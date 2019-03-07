const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    main: './debug/main.js'
    // vendor: ['pixi.js']
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ""
  },
  optimization: {
    minimize: true, //是否进行代码压缩
    splitChunks: {
      chunks: "all",
      minSize: 30000, //模块大于30k会被抽离到公共模块
      minChunks: 1, //模块出现1次就会被抽离到公共模块
      maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
      maxInitialRequests: 3, //入口模块最多只能加载3个
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    },
    runtimeChunk: {
      name: "runtime"
    }
  },
  resolve: {
    alias: {
      $assets: path.resolve(__dirname, './assets'),
      $lib: path.resolve(__dirname, './lib')
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: [
          path.resolve(__dirname ,'node_modules')
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: './assets/',
        to: 'assets/',
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: './lib/',
        to: 'lib/',
      }
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        resolve: {
          extensions: ['', '.ts', 'js']
        }
      }
    })
  ],
}