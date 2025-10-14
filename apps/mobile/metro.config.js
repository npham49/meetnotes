const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { wrapWithAudioAPIMetroConfig } = require('react-native-audio-api/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = wrapWithAudioAPIMetroConfig(
  withNativeWind(config, { input: './global.css', inlineRem: 16 })
);
