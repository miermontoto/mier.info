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
            return `<script src="${filepath.replace('src', '')}" defer></script>`;
        }

        console.log(`Script file ${filename}.js not found in /src/static/js/`);
        return '';
    });

    eleventyConfig.addShortcode("addStyle", function (filename) {
        let filepath = findFileInDir("./src/static/css", `${filename}.sass`);
        if (filepath) {
            return `<link rel="stylesheet" href="${filepath.replace('src', '').replace('.sass', '.css')}">`;
        }

        console.log(`Style file ${filename}.sass not found in /src/static/css/`);
        return '';
    });

    eleventyConfig.addShortcode("keywords", function() {
        return `<meta name="keywords" content="${require('./package.json').keywords.join(', ')}">`;
    });

    eleventyConfig.addShortcode("version", function() {
        let json = require('./package.json');
        let version = json.version;
        let channel = json.channel && json.channel !== 'RTW' ? ` (${json.channel})` : '';
        let versionString = `${version}${channel}`;
        return `<a id="version-tag" href="https://github.com/miermontoto/miermontoto/commit/${json.channel === "RTW" ? 'main' : 'beta'}" target="_blank">${versionString}</span>`;
    });

    eleventyConfig.addShortcode("top", function() {
        return `<span id="top" class="button topbtn">top ↑</span>`;
    });

    eleventyConfig.addShortcode("questions", function(json) {
        let blocks = ['socrative', 'otros'];
        let template = `<div id="block-selection"> <h3>preguntas.</h3> <ul>`;
        blocks.forEach(b => {
            template += `<li><code>${b}</code>: ${json[b]['info']}</li>`;
        });
        template += '<li><code>examen:</code> selección de preguntas que aparecieron en el examen de 23-24</li>'
        template += '<li><code>todas</code>: todas las preguntas</li></ul>';

        blocks.forEach((b) => {
            template += `<span class="button select-block" id="${b}">${b}</span>`
        });

        template += '<span class="button select-block" id="exam">examen</span>'
        template += '<span class="button select-block" id="all">todas</span>';
        template += '</div> <hr> <div id="questions">';

        blocks.forEach((block) => {
            let questions = json[block]['questions'];

            questions.forEach((q) => {
                let exam = q.exam == "true";

                template += `
                    <div class="question-block" block="${block}" exam="${exam}">
                        <h2 class="question">
                            ${q.title}
                        </h2>
                `;

                if (q.options) {
                    template += `<div class="options">`;

                    q.options.forEach((o, j) => {
                        template += `<h3 class="option">${j+1}. ${o}</h3>`;
                    });

                    template += `</div>`;
                }

                let shuffle = q.shuffle != "false";

                template += `<div class="answer-block" shuffle="${shuffle}">`;
                q.answers.forEach((a, j) => {
                    template += `
                    <span class="button answer${j == q.correct ? " correct" : ""}">
                        ${a}
                    </span> <br>`;
                });

                template += '</div>';
                if (exam || !shuffle) {
                    template += `<ul class="asterisks">
                        ${exam ? '<li class="exam">pregunta de examen reciente</span>' : ''}
                        ${!shuffle ? '<li class="shuffle">orden de respuestas fijado</li>' : ''}
                    </ul>`;
                }
                template += '</div>';
            });
        });

        template += `</div>`;
        return template;
    });

    return {
        dir: {
            input: "src",
            includes: "templates"
        }
    };
};
