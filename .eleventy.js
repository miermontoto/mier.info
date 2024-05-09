
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Nunjucks = require("nunjucks");

const buildBreadcrumbs = require('./src/building/breadcrumbs.js');
const buildChangelog = require('./src/building/changelog.js');
const addAsset = require('./src/building/linking.js');
const { qka, quizButtons, quizQuestions } = require('./src/building/quizzing.js');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/js");
    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addPassthroughCopy("**.json");
    eleventyConfig.setDataFileSuffixes([".data", ""]);
    eleventyConfig.setQuietMode(true);
    eleventyConfig.setServerOptions({ watch: ["src/static/css/**"] });


    eleventyConfig.addShortcode("breadcrumbs", function(navPages) { return buildBreadcrumbs(navPages, this.page) });
    eleventyConfig.addShortcode("changelog", (data) => buildChangelog(data));
    eleventyConfig.addShortcode("qka", (data) => qka(data));
    eleventyConfig.addShortcode("quizButtons", (json) => quizButtons(json));
    eleventyConfig.addShortcode("quizQuestions", (json) => quizQuestions(json));
    eleventyConfig.addShortcode("addScript", (filename) => addAsset("script", filename));
    eleventyConfig.addShortcode("addStyle", (filename) => addAsset("style", filename));

    eleventyConfig.addShortcode("keywords", () => {
        let json = require('./package.json');
        if (!json.keywords) {
            console.log('keywords not found in package.json');
            return '';
        }
        return `<meta name="keywords" content="${json.keywords.join(', ')}">`;
    });

    eleventyConfig.addShortcode("version", () => {
        let json = require('./package.json');
        let version = json.version;
        let channel = json.channel && json.channel !== 'RTW' ? ` (${json.channel})` : '';
        return `<a id="version-tag" href="/changelog/">${version}${channel}</a>`;
    });


    eleventyConfig.setLibrary("njk", new Nunjucks.Environment(
        new Nunjucks.FileSystemLoader("./"),
        { lstripBlocks: true, trimBlocks: true }
    ));

    return {
        dir: {
            input: "src",
            includes: "templates",
            data: "content/data"
        }
    };
};
