#!/usr/bin/env node

import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { readFile, stat } from "fs/promises";
import { createReadStream } from "fs";
import { glob } from "glob";
import { lookup } from "mime-types";
import dotenv from "dotenv";

// cargar variables de entorno (solo si existe el archivo .env)
try {
  dotenv.config();
} catch (error) {
  // ignorar si no existe .env, usar variables de entorno del sistema
}

const REQUIRED_ENV = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

// verificar variables requeridas
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Error: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// configuración del cliente s3
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// tamaño máximo para upload simple (5mb)
const MULTIPART_THRESHOLD = 5 * 1024 * 1024;

// subir todo el directorio assets
const ASSET_DIRS = ["assets"];

async function uploadFile(filePath, key) {
  try {
    const fileStats = await stat(filePath);
    const contentType = lookup(filePath) || "application/octet-stream";

    if (fileStats.size > MULTIPART_THRESHOLD) {
      // usar multipart para archivos grandes
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: BUCKET_NAME,
          Key: key,
          Body: createReadStream(filePath),
          ContentType: contentType,
        },
        queueSize: 4,
        partSize: 1024 * 1024 * 5, // 5mb por parte
        leavePartsOnError: false,
      });

      upload.on("httpUploadProgress", (progress) => {
        const percent = Math.round((progress.loaded / progress.total) * 100);
        process.stdout.write(`\r  Uploading ${key}: ${percent}%`);
      });

      await upload.done();
      process.stdout.write("\n");
    } else {
      // upload simple para archivos pequeños
      const fileContent = await readFile(filePath);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: fileContent,
          ContentType: contentType,
        }),
      );
    }

    console.log(`  ✓ Uploaded ${key}`);
  } catch (error) {
    throw new Error(`Failed to upload ${filePath}: ${error.message}`);
  }
}

async function listExistingFiles() {
  const existingFiles = new Set();
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      response.Contents.forEach((obj) => existingFiles.add(obj.Key));
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return existingFiles;
}

async function syncAssets() {
  console.log("Starting R2 sync...\n");

  // obtener archivos existentes en r2
  console.log("Checking existing files in R2...");
  const existingFiles = await listExistingFiles();
  console.log(`Found ${existingFiles.size} existing files in R2\n`);

  const uploadedFiles = [];
  const skippedFiles = [];

  for (const dir of ASSET_DIRS) {
    const pattern = `${dir}/**/*`;
    const files = await glob(pattern, { nodir: true });

    console.log(`\nProcessing ${dir}: ${files.length} files`);

    for (const file of files) {
      const key = file; // mantener la estructura de directorios

      if (existingFiles.has(key)) {
        skippedFiles.push(key);
        console.log(`  Skipping ${key} (already exists)`);
        continue;
      }

      try {
        await uploadFile(file, key);
        uploadedFiles.push(key);
      } catch (error) {
        console.error(`  ✗ Failed to upload ${key}: ${error.message}`);
      }
    }
  }

  // resumen
  console.log("\n" + "=".repeat(60));
  console.log("Upload Summary:");
  console.log(`  Uploaded: ${uploadedFiles.length} files`);
  console.log(`  Skipped: ${skippedFiles.length} files (already exist)`);
}

// ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  syncAssets().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
}
