module.exports = function (config) {
  const cssRule = config.module.rules.find((rule) =>
    rule.test.toString().match(/css\$/)
  );

  cssRule.use.push({
    loader: "postcss-loader",
  });

  //   styleRules.forEach((rule) => {
  //     const cssLoader = rule.use.find((use) => use.loader === "css-loader");
  //     // this is the actual modification we make:
  //     cssLoader.options.modules = "local";
  //   });

  return config;
};
