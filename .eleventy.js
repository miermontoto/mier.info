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

  eleventyConfig.addShortcode("breadcrumbs", buildBreadcrumbs);
  eleventyConfig.addShortcode("treemap", buildTreemap);
  eleventyConfig.addShortcode("changelog", buildChangelog);

  eleventyConfig.addShortcode("tilTags", buildTagWall);
  eleventyConfig.addShortcode("tilRecents", getRecents);
  eleventyConfig.addShortcode("tilRelated", getRelated);
  eleventyConfig.addShortcode("tilTimestamps", buildTimestamps);

  eleventyConfig.addShortcode("qka", qka);
  eleventyConfig.addShortcode("quizButtons", quizButtons);
  eleventyConfig.addShortcode("quizQuestions", quizQuestions);

  eleventyConfig.addShortcode("addScript", (filename) => addAsset("script", filename));
  eleventyConfig.addShortcode("addStyle", (filename) => addAsset("style", filename));

  eleventyConfig.addShortcode("keywords", buildKeywords);
  eleventyConfig.addShortcode("version", buildVersionTag);

  eleventyConfig.addShortcode("ref", (url, num) => `<a href="${url}" class="ref" target="_blank" rel="noopener noreferrer">[${num}]</a>`);
  eleventyConfig.addShortcode("tilImg", (file, alt) => `<figure class="til-img">
    <img src="/assets/media/projects/til/${file}" alt="${alt}" />
    <figcaption class="til-img-alt">${alt}</figcaption>
  </figure>`);

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
