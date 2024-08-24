---
title: "accessing <code>package.json</code> in Eleventy shortcodes"
tags: ["eleventy"]
eleventyNavigation:
  key: "eleventy-package"
keywords: ["eleventy", "package.json", "shortcodes", "package", "json"]
---

for a long time now, I've been using a custom shortcode in Eleventy through the
configuration file (`.eleventy.js`) to access the `package.json` file. This is
useful for various reasons, such as displaying the version number of the package
or the using the package's keywords in the metadata of the website.

because I was directly accessing the `package.json` file, I had to import it
using `require` like so:

```js
let json = require('./package.json');
```

this works fine, but restricts the definition of the shortcode to the config
file itself, which is not ideal. I wanted to separate the shortcode from the
config file so that it's easier to manage and maintain.

```js
eleventyConfig.addShortcode("version", () => {
    let json = require('./package.json');
    let version = json.version;
    let channel = json.channel && json.channel !== 'RTW' ? ` (${json.channel})` : '';
    return `<a id="version-tag" href="/changelog/">${version}${channel}</a>`;
});
```

while browsing the Eleventy documentation, I came across the
*Eleventy Supplied Data*. In it, I found that the content of the `package.json`
file is available through the `pkg` data value in the template files. This
means that I can access the `package.json` file directly in the template files
without having to import it in the configuration file:

```
{% raw %}{% pkg.version %}{% endraw %}
```

this is a much cleaner way to access the version number of the package, and as
such I can migrate the function for the shortcode to a separate script file:

```js
const { buildVersionTag, buildKeywords } = require("./src/static/js/building/package.js");

module.exports = function(eleventyConfig) {
  // ...
  eleventyConfig.addShortcode("version", (pkg) => buildVersionTag(pkg));
  eleventyConfig.addShortcode("keywords", (pkg) => buildKeywords(pkg));
  // ...
};
```
