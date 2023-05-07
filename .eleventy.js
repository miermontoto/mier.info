const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyRenderPlugin);

    eleventyConfig.addPassthroughCopy("./src/static/**");
    eleventyConfig.addPassthroughCopy("./src/content/**");
    eleventyConfig.addPassthroughCopy("./assets/**");
    eleventyConfig.addPassthroughCopy("./src/files/**");

    return {
        dir: {
            input: "src",
            includes: "templates"
        }
    };
};
