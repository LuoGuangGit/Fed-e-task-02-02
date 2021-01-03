const webpack = require('webpack');
const { merge } = require('webpack-merge'); // 合并配置插件
const common = require('./webpack.common');

/** @type{import('webpack').Configuration} */
module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    open: true, // 开启服务器时是否自动打开浏览器
    contentBase: './public' // 配置静态资源访问路径
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 开发服务器热更新插件声明
  ]
})