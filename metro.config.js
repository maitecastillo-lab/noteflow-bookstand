const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'dom-helpers/css': path.resolve(__dirname, 'node_modules/dom-helpers/style/index.js'),
  'dom-helpers/offset': path.resolve(__dirname, 'node_modules/dom-helpers/query/offset.js'),
  'dom-helpers/position': path.resolve(__dirname, 'node_modules/dom-helpers/query/position.js'),
  'dom-helpers/scrollLeft': path.resolve(__dirname, 'node_modules/dom-helpers/query/scrollLeft.js'),
  'dom-helpers/scrollTop': path.resolve(__dirname, 'node_modules/dom-helpers/query/scrollTop.js'),
};

module.exports = withNativeWind(config, { input: './global.css' });