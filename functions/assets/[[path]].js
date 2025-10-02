// cloudflare pages function para servir assets desde r2
// maneja todas las rutas bajo /assets/ y las sirve desde el bucket r2

export async function onRequestGet(ctx) {
  // extraer la ruta del asset desde la url
  const url = new URL(ctx.request.url);
  const assetPath = url.pathname.replace("/assets/", "assets/");

  try {
    // obtener el archivo desde r2
    const file = await ctx.env.MEDIA_BUCKET.get(assetPath);

    if (!file) {
      return new Response("Asset not found", { status: 404 });
    }

    // determinar content-type desde los metadatos del archivo
    const contentType = file.httpMetadata?.contentType || "application/octet-stream";

    // headers para cacheo agresivo (1 año)
    const headers = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "ETag": file.etag,
    };

    // devolver el archivo con los headers apropiados
    return new Response(file.body, { headers });
  } catch (error) {
    console.error("Error serving asset:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}