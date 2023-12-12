const fs = require("fs");
const path = require("path");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Nunjucks = require("nunjucks");

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

function getBlocksFromJson(json) {
    let blocks = [];
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const element = json[key];
            if (element['questions']) {
                blocks.push(key);
            }
        }
    }
    return blocks
}

function findSelfInNavPages(navPages, url) {
    for (const page of navPages) {
        if (page.key == url) {
            return page;
        }
        if (page.children) {
            let result = findSelfInNavPages(page.children, url);
            if (result) return result;
        }
    }

    return null;
}

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/js");
    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addPassthroughCopy("**.json");
    eleventyConfig.setDataFileSuffixes([".data", ""]);
    eleventyConfig.setQuietMode(true);
    eleventyConfig.setServerOptions({
        watch: ["src/static/css/**"]
    });

    eleventyConfig.addShortcode("addScript", function (filename) {
        let filepath = findFileInDir("./src/static/js", `${filename}.js`);
        if (filepath) {
            return `<script type="module" src="${filepath.replace('src', '')}"></script>`;
        }

        console.log(`script file ${filename}.js not found in /src/static/js/`);
        return '';
    });

    eleventyConfig.addShortcode("addStyle", function (filename) {
        let filepath = findFileInDir("./src/static/css", `${filename}.sass`);
        if (filepath) {
            return `<link rel="stylesheet" href="${filepath.replace('src', '').replace('.sass', '.css')}">`;
        }

        console.log(`style file ${filename}.sass not found in /src/static/css/`);
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
        return `<a id="version-tag" href="https://github.com/miermontoto/miermontoto/commit/${json.channel === "RTW" ? 'main' : 'beta'}" target="_blank">${versionString}</a>`;
    });

    eleventyConfig.addShortcode("breadcrumbs", function(navPages) {
        if (!this.page.url) return ''; // if permalink is false in frontmatter, don't show breadcrumbs
        let targetName = this.page.url.replace('/', '').replace('/', '').replace('.html', '').toLowerCase();
        // let beta = this.page.url.replace('.html', '').split('/');
        // beta.shift();
        // beta = beta.join('/');
        // if (beta.endsWith('/')) beta = beta.slice(0, -1);
        let currentPage = findSelfInNavPages(navPages, targetName);
        if (!currentPage) {
            console.log(`unable to produce breadcrumbs for ${targetName}.`);
            return '';
        }
        let html = `<nav aria-label="breadcrumbs" id="breadcrumbs">$ <a href="/">/</a>`;


        if (currentPage.parent) {
            let parentPage = findSelfInNavPages(navPages, currentPage.parent);
            html += `<span class="bc-spacer"> > </span><a class="bc-target" href="${parentPage.url}">${parentPage.key}</a>`;
        }
        html += `<span class="bc-spacer"> > </span><b class="bc-target">${currentPage.title || currentPage.key}</b>`;
        html += `</nav>`;
        return html;
    });

    eleventyConfig.addShortcode("top", function() {
        return `<span id="top" class="button topbtn">top ↑</span>`;
    });

    eleventyConfig.addShortcode("quizButtons", function(json) {
        let blocks = getBlocksFromJson(json);
        if (blocks.length == 0 || blocks.length == 1) return '';

        let template = `<div id="block-selection"> <h3>preguntas.</h3> <ul>`;
        blocks.forEach(b => {
            template += `<li><code>${b}</code>: ${json[b]['info']}</li>`;
        });
        template += '<li><code>todas</code>: todas las preguntas</li></ul>';

        blocks.forEach((b) => {
            template += `<span class="button select-block" id="${b}">${b}</span>`
        });

        template += '<span class="button select-block" id="all">todas</span>';
        template += '</div>';
        return template;
    });

    eleventyConfig.addShortcode("quizQuestions", function(json) {
        let blocks = getBlocksFromJson(json);
        let template = '<div id="questions">';

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
                        ${exam ? '<li class="exam">pregunta de examen reciente</li>' : ''}
                        ${!shuffle ? '<li class="shuffle">orden de respuestas fijado</li>' : ''}
                    </ul>`;
                }
                template += '</div>';
            });
        });

        template += `</div>`;
        return template;
    });

    const nunjucksEnvironment = new Nunjucks.Environment(
        new Nunjucks.FileSystemLoader("./"),
        {
            lstripBlocks: true,
            trimBlocks: true
        }
    );

    eleventyConfig.setLibrary("njk", nunjucksEnvironment);

    return {
        dir: {
            input: "src",
            includes: "templates",
            data: "content/data"
        }
    };
};
