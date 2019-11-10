const fs = require("fs");
const inclusiveLangPlugin = require("@11ty/eleventy-plugin-inclusive-language");
const moment = require("moment-timezone");
const htmlmin = require("html-minifier");

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Shortcodes
  eleventyConfig.addShortcode("readableDuration", (startedAt, endedAt) => {
    const formattedStart = moment
      .utc(startedAt)
      .tz("Europe/London")
      .format("dddd Do MMMM YYYY, HH:mm");

    const formattedEnd = moment
      .utc(endedAt)
      .tz("Europe/London")
      .format("HH:mm");

    return `${formattedStart} to ${formattedEnd}`;
  });

  eleventyConfig.addPairedShortcode("isFuture", (content, startedAt) => {
    return moment.utc(startedAt).isAfter(moment.utc()) ? content : "";
  });

  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (!outputPath.includes(".html")) {
      return content;
    }

    return htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true
    });
  });

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
