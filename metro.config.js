const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// ✅ WebSocket Fix for React Native
config.resolver.extraNodeModules = {
  ws: require.resolve("react-native-websockets"),
};

// ✅ Fix for SVG files
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = config;
