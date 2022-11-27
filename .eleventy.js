module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/static/**");
    eleventyConfig.addPassthroughCopy("./assets/**");

    return {
        dir: {
            input: "src",
            includes: "templates"
        }
    };
};