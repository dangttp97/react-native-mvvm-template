module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: [
    "./src/assets/fonts",
    "./src/assets/icons",
    "./src/assets/images",
    "./src/assets/localization",
  ],
  dependencies: {
    ...(process.env.NO_FLIPPER
      ? {
          "react-native-flipper": {
            platforms: {
              ios: null,
            },
          },
        }
      : {}),
  },
};
