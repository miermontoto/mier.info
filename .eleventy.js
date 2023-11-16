const fs = require("fs");
const path = require("path");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

function findFileInDir(dir, filename) {
    let files = fs.readdirSync(dir);

    for (const file of files) {
        let filepath = path.join(dir, file);

        if (fs.statSync(filepath).isDirectory()) {
            let result = findFileInDir(filepath, filename);
            if (result) return result;
        } else if (path.basename(filepath) === filename) {
            return filepath;
        }
    }

    return null;
}

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/js");
    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addPassthroughCopy("**.data.json");
    eleventyConfig.setDataFileSuffixes([".data", ""]);
    eleventyConfig.setQuietMode(true);
    eleventyConfig.setServerOptions({
        watch: ["src/static/css/**"]
    });

    eleventyConfig.addShortcode("addScript", function (filename) {
        let filepath = findFileInDir("./src/static/js", `${filename}.js`);
        if (filepath) {
            return `<script src="${filepath.replace('src', '')}"></script>`;
        }

        console.log(`JS file ${filename} not found in ./src/static/js`);
        return '';
    });

    eleventyConfig.addShortcode("addStyle", function (filename) {
        let filepath = findFileInDir("./src/static/css", `${filename}.sass`);
        if (filepath) {
            return `<link rel="stylesheet" href="${filepath.replace('src', '').replace('.sass', '.css')}">`;
        }

        console.log(`CSS file ${filename} not found in ./src/static/css`);
        return '';
    });

    eleventyConfig.addShortcode("keywords", function() {
        return `<meta name="keywords" content="${require('./package.json').keywords.join(', ')}">`;
    });

    eleventyConfig.addShortcode("version", function() {
        let json = require('./package.json');
        let version = json.version;
        let channel = json.channel && json.channel !== 'RTW' ? ` (${json.channel})` : '';
        return `${version}${channel}`;
    });

    eleventyConfig.addShortcode("top", function() {
        return `
        <span id="top" class="button topbtn">top ↑</span>
        `;
    });

    eleventyConfig.addShortcode("questions", function(qs) {
        let template = ``;

        qs.forEach((q, i) => {
            template += `
            <div class="question-block">
                <h2 class="question">
                    ${q.title}
                </h2>
            `;

            let shuffle = q.shuffle || true;

            template += `<div class="answer-block" shuffle="${shuffle}">`;
            q.answers.forEach((a, j) => {
                template += `
                <span class="button answer${j == q.correct ? " correct" : ""}">
                    ${a}
                </span> <br>`;
            });

            template += `
                </div>
                ${shuffle == "false" ? '<i>* orden de respuestas fijado</i>' : ''}
            </div>
            `;
        });

        return template;
    });

    return {
        dir: {
            input: "src",
            includes: "templates"
        }
    };
};
