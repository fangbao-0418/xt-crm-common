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
  addBabelPlugins,
  setWebpackOptimizationSplitChunks
} = require('customize-cra')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const paths = require('react-scripts/config/paths')
const fs = require('fs')
// const pubconfig = fs.existsSync('./pubconfig.json')
//   ? require('./pubconfig.json')
//   : {
//     outputDir: 'build'
//   }
const PUB_ENV = process.env.PUB_ENV || 'dev'

const pubconfig = {
  outputDir: 'build'
}

paths.appBuild = path.resolve(pubconfig.outputDir)

console.log('PUB_ENV => ', PUB_ENV)
// const dev = process.env.PUB_ENV !== 'prod'
const isDevelopment = ['dev'].indexOf(PUB_ENV) > -1
const isProduction = !isDevelopment
const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isDevelopment && require.resolve('style-loader'),
    isProduction && {
      loader: MiniCssExtractPlugin.loader
      /*
       * options: Object.assign({})
       * shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
       */
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions
    },
    {
      /*
       * Options for PostCSS as we reference these options twice
       * Adds vendor prefixing based on your specified browser support in
       * package.json
       */
      loader: require.resolve('postcss-loader'),
      options: {
        /*
         * Necessary for external CSS imports to work
         * https://github.com/facebook/create-react-app/issues/2677
         */
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
        sourceMap: isDevelopment
      }
    }
  ].filter(Boolean)
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: isDevelopment
      }
    })
  }
  return loaders
}

module.exports = override(
  ...addBabelPlugins(
    '@babel/plugin-proposal-optional-chaining'
  ),
  addWebpackModuleRule({
    test: /\.m(odule)?.styl/,
    exclude: /node_modules/,
    use: getStyleLoaders(
      {
        importLoaders: 2,
        sourceMap: isDevelopment,
        modules: true,
        getLocalIdent: getCSSModuleLocalIdent
      },
      'stylus-loader'
    )
  }),
  removeModuleScopePlugin(),
  /*
   * fixBabelImports('import', {
   *   libraryName: 'antd',
   *   style: 'css',
   *   libraryDirectory: 'es' // change importing css to less
   * }),
   */
  fixBabelImports('lodash', {
    libraryDirectory: '',
    camel2DashComponentName: false
  }),
  addDecoratorsLegacy(),
  addWebpackPlugin(new webpack.ProvidePlugin({
    APP: path.resolve(__dirname, 'src/util/app')
  })),
  addWebpackPlugin(new webpack.DefinePlugin({
    'process.env': {
      PUB_ENV: JSON.stringify(PUB_ENV)
    }
  })),
  addWebpackPlugin(new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, 'src/assets/root')
    }
  ])),
  useEslintRc(),
  // isDevelopment ? undefined : disableEsLint(),
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
        name: 'vendors',
        chunks: 'all'
      }
    }
  }),
  (function () {
    return (config) => {
      config.devtool = isDevelopment ? config.devtool : ''
      return config
    }
  })()
)
