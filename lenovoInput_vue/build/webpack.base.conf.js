var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
//var projectRoot = path.resolve(__dirname, '../')

var entries = utils.getEntry('./client/module/*/*.js')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('client'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'client': resolve('client'),
      'assets': resolve('client/src/assets'),
      'components': resolve('client/src/components'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ],
    loaders: [
      { test: /\.woff(\?.*)?$/,  loader: 'url?name=fonts/[name].[ext]' },
      { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
      { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
      { test: /\.ttf(\?.*)?$/,   loader: 'url?name=fonts/[name].[ext]' },
      { test: /\.eot(\?.*)?$/,   loader: 'url?name=fonts/[name].[ext]' },
      { test: /\.svg(\?.*)?$/,   loader: 'url?limit=1024&name=img/[name].[ext]' },
      { test: /\.swf(\?.*)?$/,   loader: 'file?prefix=swf/&name=[path][name].[ext]&limit=10000&mimetype=application/swf'},
      { test: /\.(png|jpg|gif)$/,    loader: 'url?limit=8192&name=[name]_[hash:8].[ext]' }
    ]
  }
}
