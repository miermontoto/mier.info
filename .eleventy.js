
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Nunjucks = require("nunjucks");

const buildBreadcrumbs = require('./src/static/js/building/breadcrumbs.js');
const buildTreemap = require('./src/static/js/building/treemap.js');
const buildChangelog = require('./src/static/js/building/changelog.js');
const { buildTagWall, getRecents, getRelated, buildTimestamps } = require('./src/static/js/building/tilling.js');
const addAsset = require('./src/static/js/building/linking.js');
const { qka, quizButtons, quizQuestions } = require('./src/static/js/building/quizzing.js');
const { buildVersionTag, buildKeywords } = require("./src/static/js/building/package.js");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/js");
    eleventyConfig.addPassthroughCopy("./assets");
    eleventyConfig.addPassthroughCopy("**.json");
    eleventyConfig.setDataFileSuffixes([".data", ""]);
    eleventyConfig.setQuietMode(true);
    eleventyConfig.setServerOptions({ watch: ["src/static/css/**"], port: 8088 });

    eleventyConfig.addShortcode("breadcrumbs", function (navPages) { return buildBreadcrumbs(navPages, this.page) });
    eleventyConfig.addShortcode("treemap", function (navPages) { return buildTreemap(navPages) });
    eleventyConfig.addShortcode("changelog", (data, pkg) => buildChangelog(data, pkg));

    eleventyConfig.addShortcode("tilTags", (data) => buildTagWall(data));
    eleventyConfig.addShortcode("tilRecents", (data) => getRecents(data));
    eleventyConfig.addShortcode("tilRelated", (data, current) => getRelated(data, current));
    eleventyConfig.addShortcode("tilTimestamps", buildTimestamps);

    eleventyConfig.addShortcode("qka", (data) => qka(data));
    eleventyConfig.addShortcode("quizButtons", (json) => quizButtons(json));
    eleventyConfig.addShortcode("quizQuestions", (json) => quizQuestions(json));

    eleventyConfig.addShortcode("addScript", (filename) => addAsset("script", filename));
    eleventyConfig.addShortcode("addStyle", (filename) => addAsset("style", filename));

    eleventyConfig.addShortcode("keywords", (pkg) => buildKeywords(pkg));
    eleventyConfig.addShortcode("version", (pkg) => buildVersionTag(pkg));

    eleventyConfig.addShortcode("reference", (url, num) => `<a href="${url}" class="reference" target="_blank" rel="noopener noreferrer">[${num}]</a>`);

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
