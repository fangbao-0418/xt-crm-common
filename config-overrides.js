const { override, fixBabelImports, addDecoratorsLegacy, useEslintRc, addWebpackAlias } = require('customize-cra');
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
  useEslintRc(),
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src/'),
  })
);
