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
        let json = require('./package.json');
        if (!json.keywords) {
            console.log('keywords not found in package.json');
            return '';
        }
        return `<meta name="keywords" content="${json.keywords.join(', ')}">`;
    });

    eleventyConfig.addShortcode("version", function() {
        let json = require('./package.json');
        let version = json.version;
        let channel = json.channel && json.channel !== 'RTW' ? ` (${json.channel})` : '';
        return `<a id="version-tag" href="/changelog/" target="_blank">${version}${channel}</a>`;
    });

    // function to get the changelog from the github commit history
    eleventyConfig.addShortcode("changelog", function(data) {
        let content = '<div id="changelog">'

        // if the current version isn't in the changelog, add it manually to the data array
        let currentJson = require('./package.json')
        let currentVersion = currentJson.version.split('.')
        let currentChannel = currentJson.channel ? ` ${currentJson.channel}` : ''
        if (!data.find(d => d.version.major == currentVersion[1] && d.version.minor == currentVersion[2])) {
            data.push({
                "version": {
                    "major": currentVersion[1],
                    "minor": currentVersion[2]
                },
                "title": `${currentVersion[1]}.${currentVersion[2]}${currentChannel}`,
                "date": "ongoing",
                "message": "<span class='warning'>unreported changes: please run <code>npm run changelog</code></span>",
                "hash": null
            })
        }

        // sort commits by version
        data.sort((a, b) => {
            return a.version.major > b.version.major ? -1 : 1;
        })

        let prevMajor = null
        data.forEach((d) => {
            if (prevMajor != d.version.major) {
                if (prevMajor) content += '<hr>'
                content += `<h1>v${d.version.major}</h1>`
            }
            prevMajor = d.version.major
            content += `<div class="entry hoverborder">
                <span class="title">${d.title}</span>`
            if (d.message) content += `<br><span class="message">${d.message.replace(/\n/g, '<br>')}</span>`
            content += `<a class="date" href="https://github.com/miermontoto/mier.info/commit/${d.hash}" target="_blank">${d.date}</a></div>`
        })
        content += '</div>'
        return content
    })

    eleventyConfig.addShortcode("breadcrumbs", function(navPages) {
        if (!this.page.url) return ''; // if permalink is false in frontmatter, don't show breadcrumbs

        let targetName = this.page.url.replace('/', '').replace('/', '').replace('.html', '').toLowerCase();
        // let targetName = this.page.url.replace('.html', '').split('/');
        // targetName.shift();
        // targetName = targetName.join('/');
        // if (targetName.endsWith('/')) targetName = targetName.slice(0, -1);

        let currentPage = findSelfInNavPages(navPages, targetName);
        if (!currentPage) {
            console.log(`unable to produce breadcrumbs for ${targetName}.`);
            return '';
        }
        let html = `<nav aria-label="breadcrumbs" id="breadcrumbs">$ <a href="/" id="indx-btn">/</a>`;


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

    eleventyConfig.addShortcode("qka", function(data) {
        let template = ""
        data.forEach((d, i) => {
            let sources = d.s ? d.s.map(s => `<li><a href="${s}">${s}</a></li>`).join(' ') : null;
            template += `<div class="doubt hoverborder">
                <span class="question">${i+1}. ${d.q}</span>`;
            if (d.a) template += `<span class="answer">${d.a}</span>`
            if (sources) template += `<span class="sources">sources: <br>${sources}</span>`
            if (d.k && d.d) template += `<span class="bottom">keywords: <code>${d.k}</code>, date asked: ${d.d}</span>`
            else console.log('warning: question missing keywords or date')
            template += `</div>`
        })
        return template
    });

    eleventyConfig.addShortcode("quizButtons", function(json) {
        let blocks = getBlocksFromJson(json);
        if (blocks.length <= 1) return '';

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
