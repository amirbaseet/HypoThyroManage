module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Existing dotenv support
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      // New module resolver for absolute paths
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            api: './src/api',
            components: './src/components',
            hooks: './src/hooks',
            locales: './src/locales',
            navigation: './src/navigation',
            screens: './src/screens',
            services: './src/services',
            styles: './src/styles',
            utils: './src/utils',
            context: './src/context',
            assets: './assets',
            constants:'./src/constants',
          },
        },
      ],
    ],
  };
};
