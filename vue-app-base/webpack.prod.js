const { merge } = require('webpack-merge'); // 合并配置插件
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清理打包文件夹插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取单个 css 文件插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common');

/** @type{import('webpack').Configuration} */
module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'bundle.[contenthash:6].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 清除打包文件夹
    new CopyWebpackPlugin(['public']), // 拷贝不需要处理的文件到打包目录
    new MiniCssExtractPlugin(), // 将 css 提取到单独的文件当中
    new OptimizeCssAssetsWebpackPlugin() // 压缩 css 文件
  ]
})