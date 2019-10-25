const {
  override,
  fixBabelImports,
  addDecoratorsLegacy,
  useEslintRc,
  addWebpackAlias,
  addWebpackPlugin,
  removeModuleScopePlugin,
  addWebpackModuleRule
} = require('customize-cra');
const webpack = require('webpack')
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const paths = require('react-scripts/config/paths');
const pubconfig = require('./pubconfig.json');

console.log('PUB_ENV => ', process.env.PUB_ENV);
paths.appBuild = path.resolve(pubconfig.outputDir);

console.log('PUB_ENV => ', process.env.PUB_ENV);
// const dev = process.env.PUB_ENV !== 'prod'
const isEnvDevelopment = ['prod', 'pre'].indexOf(process.env.PUB_ENV) === -1
const isEnvProduction = !isEnvDevelopment
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        // shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
      ),
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: !isEnvProduction,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: !isEnvProduction,
      },
    });
  }
  return loaders;
};

module.exports = override(
  addWebpackModuleRule({
    test: /\.module.styl/,
    use: getStyleLoaders(
      {
        importLoaders: 2,
        sourceMap: !isEnvProduction,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent,
      },
      'stylus-loader'
    ),
  }),
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
