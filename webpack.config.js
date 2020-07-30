const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CreateBuildConf = require('./plugins/createBuildConf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { getMiniCssExtractLoaderConfig, getCssLoaderConfig, getPostCssLoaderConfig } = require('xt-crm-cli/config/webpack/utils')

module.exports = function (config, env) {
  const dev = env === 'dev'
  /** 构建时间 */
  const BUILD_TIME = new Date().getTime()
  // ignore verify
  config.module.rules = config.module.rules.filter((rule) => {
    return !(rule.enforce === 'pre' && (rule.test.test('.tsx') || rule.test.test('.jsx')))
  })
  const __ENV__ = process.env.NODE_ENV || 'dev'
  const app_branch = process.env.branch || 'issue2'
  const app_name = process.env.app_name || 'common'
  const app_origin = process.env.app_origin || 'http://localhost:3002'
  
  const publicPath = env === 'dev' ? `/` : `${app_origin}/${app_name}/${app_branch}/`
  
  config.output.publicPath = publicPath

  config.entry = {
    app: './src/index',
    core: './src/core.tsx'
  }
  config.output.jsonpFunction = `xt-${pkg.name}`
  // config.plugins[0].options.publishTime = new Date().getTime()
  console.log(__ENV__, 'NODE_ENV')
  config.module.rules[0].include = [
    path.resolve(__dirname, './src'),
    path.resolve(__dirname, 'src'),
    path.resolve(__dirname, 'node_modules/peek-readable'),
    path.resolve(__dirname, 'node_modules/file-type'),
    path.resolve(__dirname, 'node_modules/stream-browserify'),
    path.resolve(__dirname, 'node_modules/readable-web-to-node-stream'),
    path.resolve(__dirname, 'node_modules/strtok3')
  ]
  config.module.rules[0].exclude = undefined
  config.plugins.push(
    new webpack.DefinePlugin({
      BUILD_TIME: JSON.stringify(BUILD_TIME),
      __ENV__: JSON.stringify(__ENV__),
      'process.env': {
        APP_NAME: JSON.stringify(app_name),
        APP_BRANCH: JSON.stringify(app_branch),
        APP_ORIGIN: JSON.stringify(app_origin),
        IS_LOCAL: env === 'dev',
        PUB_ENV: JSON.stringify(__ENV__)
      }
    })
  )
  config.plugins.push(
    new CreateBuildConf({
      build_time: BUILD_TIME
    })
  )
  config.plugins.push(
    new webpack.ProvidePlugin({
      APP: path.resolve(__dirname, 'src/util/app')
    })
  )
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/assets/root')
      }
    ])
  )
  // const outdir = 'build'
  // config.output.path = path.resolve(process.cwd(), outdir),
  config.module.rules.push({
    test: /\.(xls|xlsx)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      limit: 0,
      name: env === 'dev' ? '' : 'assets/files/' + '[name].[hash:7].[ext]'
      // esModule: false,
      // encoding: false
    }
  })
  config.module.rules.push({
    test: /\.(scss|sass)$/,
    exclude: [
      /\.module\.(scss|sass)$/,
      /node_modules/
    ],
    use: [
      getMiniCssExtractLoaderConfig(dev),
      getCssLoaderConfig(dev, false),
      getPostCssLoaderConfig(true),
      {
        loader: 'sass-loader'
      }
    ]
  })
  config.module.rules.push({
    test: /\.module\.(scss|sass)$/,
    exclude: /node_modules/,
    use: [
      getMiniCssExtractLoaderConfig(dev),
      getCssLoaderConfig(dev, true),
      getPostCssLoaderConfig(true),
      {
        loader: 'sass-loader'
      }
    ]
  })
  config.optimization = {
    ...config.optimization,
    splitChunks: {
      chunks: "async",
      minSize: 0,
      minChunks: 1,
      maxAsyncRequests: 10,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          chunks: 'async'
        }
      }
    }
  }
  if (env === 'prod') {
    // config.plugins.push(new BundleAnalyzerPlugin({
    //   analyzerMode: 'static'
    // }))
  }
  config.externals = {
    '@ant-design/icons/lib/dist': 'AntDesignIcons',
    antd: 'antd',
    react: 'React',
    'react-dom': 'ReactDOM',
    imutable: 'Immutable',
    moment: 'moment',
    'ali-oss': 'OSS'
  }
  return config
}
