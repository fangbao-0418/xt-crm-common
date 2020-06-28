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
const CreateBuildConf = require('./plugins/createBuildConf')

const isLocal = process.env.PUB_ENV === undefined
const PUB_ENV = process.env.PUB_ENV || 'dev'

const originConfigs = {
  dev: 'http://daily-xt-crmadmin.hzxituan.com',
  test: 'https://test-crmadmin.hzxituan.com',
  test2: 'https://test2-crmadmin.hzxituan.com',
  pre: 'http://pre-xt-crmadmin.hzxituan.com',
  prod: 'http://xt-crmadmin.hzxituan.com'
}

/** 构建时间 */
const BUILD_TIME = new Date().getTime()
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
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator'
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
    BUILD_TIME: JSON.stringify(BUILD_TIME),
    'process.env': {
      PUB_ENV: JSON.stringify(PUB_ENV)
    }
  })),
  addWebpackPlugin(new CreateBuildConf({
    build_time: BUILD_TIME
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
      if (!isLocal) {
        const branch = process.env.branch
        const origin = originConfigs[PUB_ENV]
        const publicPath =  origin + '/common/' + branch + '/'
        config.output.publicPath = publicPath
        console.log(publicPath, 'publicPath')
      } else {
        config.output.publicPath = 'http://localhost:3000/'
      }
      config.optimization.runtimeChunk = {
        name: 'runtime'
      }
      config.mode = 'development'
      config.devtool = isDevelopment ? config.devtool : ''
      return config
    }
  })()
)
