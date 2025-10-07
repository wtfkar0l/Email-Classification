const path = require("path");

module.exports = {
  reactScriptsVersion: "react-scripts",
  style: {
    css: {
      loaderOptions: () => ({
        url: false,
      }),
    },
  },
  paths: function (paths, env) {
    paths.appSrc = path.resolve(__dirname, "src");
    paths.appIndexJs = path.resolve(__dirname, "src/index.js");
    return paths;
  },
};