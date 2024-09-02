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
const { projectImages, getFeaturedProjects, getMainProjects, getOtherProjects } = require("./src/static/js/building/projects.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addGlobalData("eleventyComputed", {
    eleventyNavigation: {
      key: data => data.eleventyNavigation.key || data.page.fileSlug,
      parent: data => data.eleventyNavigation.parent || data.page.parent,
      title: data => data.eleventyNavigation.title || data.title,
    }
  });

  eleventyConfig.addPassthroughCopy("./src/static/js"); // css is compiled by sass
  eleventyConfig.addPassthroughCopy("./assets");
  eleventyConfig.addPassthroughCopy("**.json");

  eleventyConfig.setQuietMode(true); // suppresses the "Writing" log message
  eleventyConfig.setDataFileSuffixes([".data", ""]);
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
  eleventyConfig.addShortcode("tilImg", function (file, alt) {
    return `<figure class="til-img">
      <img src="/assets/media/projects/til/${this.page.fileSlug}/${file}" alt="${alt}" />
      <figcaption class="til-img-alt">${alt}</figcaption>
    </figure>`;
  });
  eleventyConfig.addShortcode("link", (url, text) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`);

  eleventyConfig.addShortcode("projectImages", projectImages);

  eleventyConfig.addFilter("generateDesc", function (content) {
    if (!content) return "personal portfolio website that collects all my projects and professional experiences.";
    let text = content.replace(/<[^>]*>/g, '').trim();
    return text.slice(0, 160) + (text.length > 160 ? "..." : "");
  });

  eleventyConfig.addFilter("featuredProjects", getFeaturedProjects);
  eleventyConfig.addFilter("mainProjects", getMainProjects);
  eleventyConfig.addFilter("otherProjects", getOtherProjects);

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
