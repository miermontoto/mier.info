module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/static/style.css");
    eleventyConfig.addPassthroughCopy("./src/static/blog.css");

    return {
        dir: {
            input: "src",
            includes: "templates"
        }
    };
};