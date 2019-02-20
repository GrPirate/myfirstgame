const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const base = require('./webpack.base.js')

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new UglifyJSPlugin()
  ]
})
