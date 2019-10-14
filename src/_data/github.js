const path = require("path");
const fetch = require("node-fetch");
const flatcache = require("flat-cache");

function getCacheKey() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${date.getUTCMonth() +
    1}-${date.getUTCDate()}`;
}

module.exports = async () => {
  console.log("Fetching github contributors...");

  const cache = flatcache.load("github.json", path.resolve("./_cache"));
  const key = getCacheKey();

  let contributors = cache.getKey(`contributors-${key}`);

  if (!contributors) {
    const response = await fetch(
      "https://api.github.com/repos/leicesterjs/site/contributors"
    );

    contributors = await response.json();

    cache.setKey(`contributors-${key}`, contributors);
    cache.save();
  }

  return {
    contributors
  };
};
