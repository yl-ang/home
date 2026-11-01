// @excalidraw/excalidraw ships strict ESM with extension-less deep imports
// (e.g. 'roughjs/bin/rough'). CRA's webpack 5 config rejects those, so relax
// fullySpecified for node_modules JS.
module.exports = {
  webpack: {
    configure: (config) => {
      config.module.rules.push({
        test: /\.m?js$/,
        include: /node_modules/,
        resolve: { fullySpecified: false },
      });
      // Excalidraw's deps ship source maps that point at unpublished .ts files.
      config.ignoreWarnings = [...(config.ignoreWarnings || []), /Failed to parse source map/];
      return config;
    },
  },
};
