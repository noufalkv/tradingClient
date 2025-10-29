// const { Platform } = require("react-native");

// Disable React Native feature flags to avoid UnsatisfiedLinkError: libreact_featureflagsjni.so
process.env.REACT_NATIVE_FEATURE_FLAGS_DISABLED = true;

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
