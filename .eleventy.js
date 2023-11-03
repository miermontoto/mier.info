const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/js/**");
    eleventyConfig.addPassthroughCopy("./assets/**");

    eleventyConfig.setServerOptions({
        watch: ["_site/static/**"]
    });

    eleventyConfig.addShortcode("version", function() {
        let json = require('./package.json');
        let version = json.version || 'unknown';
        let release = json.release && json.release !== 'RTW' ? ` (${json.release})` : '';
        return `${version}${release}`;
    });

    eleventyConfig.addShortcode("top", function() {
        return `
        <span id="top" class="button">top ↑</span>
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
