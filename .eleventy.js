const fs = require("fs");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Plugins
  eleventyConfig.addPlugin(inclusiveLangPlugin);

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: (err, browserSync) => {
        const content_404 = fs.readFileSync("_site/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      includes: "_includes",
      input: "src",
      layouts: "_layouts"
    }
  };
};
