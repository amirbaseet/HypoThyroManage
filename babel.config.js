module.exports = function (api) {
    api.cache(true);
    // console.log("✅ Babel config is loaded!");

    return {
        presets: ['babel-preset-expo'],
    };
};
