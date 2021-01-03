const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 解析 .vue 文件时 vue-loader 依赖的插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 打包提取 html 插件
const webpack = require('webpack');

/** @type{import('webpack').Configuration} */
module.exports = {
  mode: 'none', // webpack4 以后不设置会有警告信息
  entry: './src/main.js', // 入口文件
  output: {
    path: path.join(__dirname, 'dist'), // 输出目录路径
    filename: 'bundle.js' // 打包后的 js 文件
  },
  module: {
    /**
     * test 文件匹配正则
     * use 使用解析的 loader，可以配置多个，多个以从后往前的顺序执行
     */
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      /**
       * 当有额外配置项时，use 定义为对象，loader 填写 loader 名，options 设置配置项
       */
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8 * 1024, // 限制 8kb 以下转为 base64 格式图片，超出使用 file-loader
            name: '[name].[contenthash:6].[ext]', // 文件名称，使用 contenthash
            esModule: false // 设置图片打包输出不以 es modules 方式导出（解决启动服务时，图片路径为[object Module]）
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'vue project',
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({ // 定义 html 模板文件中一些变量占位符匹配对应的值
      BASE_URL: '"/"'
    })
  ]
}