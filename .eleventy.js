const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/*/**");
    eleventyConfig.addPassthroughCopy("./assets/**");

    eleventyConfig.addShortcode("version", function() {
        return require("./package.json").version + ' (beta3)';
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

            template += `<div class="answer-block">`;
            q.answers.forEach((a, j) => {
                let letter = String.fromCharCode(97 + j); // convert index to letter
                template += `
                <span class="button answer ${j == q.correct ? "correct" : ""}">
                    <b>${letter}.</b> ${a}
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
