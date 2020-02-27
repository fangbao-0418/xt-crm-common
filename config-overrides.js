const {
  override,
  fixBabelImports,
  addDecoratorsLegacy,
  useEslintRc,
  disableEsLint,
  addWebpackAlias,
  addWebpackPlugin,
  removeModuleScopePlugin,
  addWebpackModuleRule,
  addWebpackExternals,
  addBundleVisualizer,
  setWebpackOptimizationSplitChunks
} = require('customize-cra');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const paths = require('react-scripts/config/paths');
const fs = require('fs');
const pubconfig = fs.existsSync('./pubconfig.json')
  ? require('./pubconfig.json')
  : {
      outputDir: 'build'
    };

paths.appBuild = path.resolve(pubconfig.outputDir);

console.log('PUB_ENV => ', process.env.PUB_ENV);
// const dev = process.env.PUB_ENV !== 'prod'
const isEnvDevelopment = ['prod', 'pre', 'test', 'dev'].indexOf(process.env.PUB_ENV) === -1;
const isEnvProduction = !isEnvDevelopment;
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {}
        // shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
      )
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
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
              flexbox: 'no-2009'
            },
            stage: 3
          })
        ],
        sourceMap: !isEnvProduction
      }
    }
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: !isEnvProduction
      }
    });
  }
  return loaders;
};

module.exports = override(
  addWebpackModuleRule({
    test: /\.module.styl/,
    exclude: /node_modules/,
    use: getStyleLoaders(
      {
        importLoaders: 2,
        sourceMap: !isEnvProduction,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent
      },
      'stylus-loader'
    )
  }),
  removeModuleScopePlugin(),
  // fixBabelImports('import', {
  //   libraryName: 'antd',
  //   style: 'css',
  //   libraryDirectory: 'es' // change importing css to less
  // }),
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false
  }),
  addDecoratorsLegacy(),
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      APP: path.resolve(__dirname, 'src/util/app')
    })
  ),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env': {
        PUB_ENV: '"' + (process.env.PUB_ENV || 'serve') + '"'
      }
    })
  ),
  addWebpackPlugin(
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/assets/root')
      },
    ])
  ),
  useEslintRc(),
  // isEnvDevelopment ? undefined : disableEsLint(),
  disableEsLint(),
  addWebpackAlias({
    packages: path.resolve(__dirname, 'packages/'),
    '@': path.resolve(__dirname, 'src/')
  }),
  addWebpackExternals({
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    imutable: 'Immutable',
    moment: 'moment',
    'ali-oss': 'OSS'
  }),
  // addBundleVisualizer(),
  setWebpackOptimizationSplitChunks({
    cacheGroups: {
      commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
      }
    }
  }),
  (function () {
    return function (config) {
      config.module.rules.unshift({
        test: /\.(ts|tsx)$/,
        loader: "tslint-loader",
        include: [path.resolve(__dirname, 'src/packages')],
        options: {
          emitErrors: function (err) { throw Errow(err) }
        },
        enforce: "pre"
      });
      if (isEnvProduction) {
        config.devtool = false;
      }
      return config;
    }
  })()
);
