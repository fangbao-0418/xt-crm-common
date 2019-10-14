const {
  override,
  fixBabelImports,
  addDecoratorsLegacy,
  useEslintRc,
  addWebpackAlias,
  addWebpackPlugin,
  removeModuleScopePlugin
} = require('customize-cra');
const webpack = require('webpack')
const path = require("path");

console.log('PUB_ENV => ', process.env.PUB_ENV);
module.exports = override(
  removeModuleScopePlugin(),
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
  })),
  addWebpackPlugin(new webpack.DefinePlugin({
    'process.env': {
      PUB_ENV: '"'+(process.env.PUB_ENV || 'serve')+'"'
    }
  })),
  useEslintRc(),
  addWebpackAlias({
    'packages': path.resolve(__dirname, 'packages/'),
    '@': path.resolve(__dirname, 'src/')
  })
);
