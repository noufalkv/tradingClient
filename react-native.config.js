// const { Platform } = require("react-native");

module.exports = {
  project: {
    ios: {},
    android: {
      packageName: 'com.rn_trading_app',
    },
  },
  'react-native-vector-icons': {
    Platforms: { ios: null },
  },
  assets: ['./src/assets/fonts/'],
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer');
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  },
};
