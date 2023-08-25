const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/*/**");
    eleventyConfig.addPassthroughCopy("./assets/**");
    eleventyConfig.addPassthroughCopy("./package.json");

    return {
        dir: {
            input: "src",
            includes: "templates"
        }
    };
};
