const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const Nunjucks = require("nunjucks");
const { detect: detectPort } = require("detect-port");

const buildBreadcrumbs = require('./src/static/js/building/breadcrumbs.js');
const buildTreemap = require('./src/static/js/building/treemap.js');
const buildChangelog = require('./src/static/js/building/changelog.js');
const { buildNavScript } = require('./src/static/js/building/navpages.js');
const { buildTagWall, getRecents, getRelated, buildTimestamps, buildWrappedImg } = require('./src/static/js/building/tilling.js');
const addAsset = require('./src/static/js/building/linking.js');
const { qka, quizButtons, quizQuestions } = require('./src/static/js/building/quizzing.js');
const { buildVersionTag, buildKeywords } = require("./src/static/js/building/package.js");
const { projectImages, getFeaturedProjects, getMainProjects, getOtherProjects } = require("./src/static/js/building/projects.js");
const { generateDescription } = require("./src/static/js/building/description.js");


const DEFAULT_PORT = 8088;

module.exports = async function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // detecta si el puerto está en uso y selecciona otro si es necesario
  const port = await detectPort(DEFAULT_PORT);
  if (port !== DEFAULT_PORT) {
    console.log(`\x1b[33m⚠ Port ${DEFAULT_PORT} in use, using ${port}\x1b[0m`);
  }

  eleventyConfig.addGlobalData("eleventyComputed", {
    eleventyNavigation: {
      key: (data) => data.eleventyNavigation.key || data.page.fileSlug,
      parent: (data) => data.eleventyNavigation.parent || data.page.parent,
      title: (data) => data.eleventyNavigation.title || data.title,
    },
  });

  eleventyConfig.addPassthroughCopy("./src/static/js"); // css is compiled by sass
  eleventyConfig.addPassthroughCopy("./assets"); // solo favicon, todo lo demás desde r2
  eleventyConfig.addPassthroughCopy("./src/content/data/*.json"); // solo json de contenido

  eleventyConfig.setQuietMode(true); // suppresses the "Writing" log message
  eleventyConfig.setDataFileSuffixes([".data", ""]);
  eleventyConfig.setServerOptions({
    port,
    watch: ["_site/static/css/**"],
  });

  eleventyConfig.addShortcode("breadcrumbs", buildBreadcrumbs);
  eleventyConfig.addShortcode("treemap", buildTreemap);
  eleventyConfig.addShortcode("changelog", buildChangelog);
  eleventyConfig.addShortcode("navScript", buildNavScript);

  eleventyConfig.addShortcode("tilTags", buildTagWall);
  eleventyConfig.addShortcode("tilRecents", getRecents);
  eleventyConfig.addShortcode("tilRelated", getRelated);
  eleventyConfig.addShortcode("tilTimestamps", buildTimestamps);
  eleventyConfig.addShortcode("tilImg", buildWrappedImg);

  eleventyConfig.addShortcode("qka", qka);
  eleventyConfig.addShortcode("quizButtons", quizButtons);
  eleventyConfig.addShortcode("quizQuestions", quizQuestions);

  eleventyConfig.addShortcode("addScript", (filename) =>
    addAsset("script", filename),
  );
  eleventyConfig.addShortcode("addStyle", (filename) =>
    addAsset("style", filename),
  );

  eleventyConfig.addShortcode("keywords", buildKeywords);
  eleventyConfig.addShortcode("version", buildVersionTag);

  eleventyConfig.addShortcode(
    "ref",
    (url, num) =>
      `<a href="${url}" class="ref" target="_blank" rel="noopener noreferrer">[${num}]</a>`,
  );
  eleventyConfig.addShortcode(
    "link",
    (url, text) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`,
  );

  eleventyConfig.addShortcode("projectImages", projectImages);

  eleventyConfig.addFilter("generateDesc", generateDescription);

  eleventyConfig.addFilter("featuredProjects", getFeaturedProjects);
  eleventyConfig.addFilter("mainProjects", getMainProjects);
  eleventyConfig.addFilter("otherProjects", getOtherProjects);

  eleventyConfig.setLibrary(
    "njk",
    new Nunjucks.Environment(new Nunjucks.FileSystemLoader("./"), {
      lstripBlocks: true,
      trimBlocks: true,
    }),
  );

  return {
    dir: {
      input: "src",
      includes: "templates",
      data: "content/data",
    },
  };
};
