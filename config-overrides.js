const {
  override,
  fixBabelImports,
  addDecoratorsLegacy,
  useEslintRc,
  addWebpackAlias,
  addWebpackPlugin
} = require('customize-cra');
const webpack = require('webpack')
const path = require("path");

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    style: 'css',
    libraryDirectory: 'es', // change importing css to less
  }),
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false,
  }),
  addDecoratorsLegacy(),
  addWebpackPlugin(new webpack.ProvidePlugin({
    APP: path.resolve(__dirname, 'src/util/app')
  }),),
  useEslintRc(),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src/'),
  })
);
