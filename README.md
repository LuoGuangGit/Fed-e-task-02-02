## 简答题
### **1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。**
* 配置入口文件，输出目录
* 在 module rule 下配置相应 loader 对不同资源进行解析转换处理
* 配置 plugins 在不同阶段对文件、目录进行处理
* 使用 webpack dev server 启动热更新服务器

> 通过 webpack.config.js 配置文件的 entry 入口文件中获取到引入的模块，再通过 loader 配置解析转换相应的模块，解析后输出到打包路径；在打包路径会生成一个引入资源模块文件的 js 文件，里面会有一个自执行的函数，参数的每一项是一个由导出模块解析转换后的内容的函数组成。

### **2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。**
loader 主要是用来加载项目中不同资源文件并做解析转换处理，例如：对于 EcmaScript Next 语法做转换处理的 webpack-babel 模块，处理 css 文件的 css-loader 和 style-loader 模块。

1. module.exports 导出一个函数
2. 该函数接收一个参数，该参数就是要处理的资源文件
3. 在函数体中处理资源文件
4. 将此次加工过后的结果返回
5. 加工过后的代码必须是 JavaScript 代码

plugins 主要通过 webpack 中的钩子机制在不同时机处理一些自动化工作，增强项目自动化的能力，例如：在打包之前清理输入文件和目录，在打包时将不需要做解析处理的文件拷贝到输出目录当中。比 loader 更宽的能力范围。

1. 必需是一个函数或者一个包含 apply 方法的对象（通常定义为一个类型 => 定义 apply 方法）
2. apply 方法接收一个此次构建的所有配置信息的参数 compiler（通过接收到的对象参数注册钩子函数）
3. 明确执行时机，通过 compiler.hooks.钩子名称.tap 注册钩子函数
4. 注册的钩子函数接收两个参数，第一个是插件名，第二个是要调用的函数（接收一个参数，此参数可以理解为本次打包的上下文）
5. 通过提供的上下文参数循环遍历（compilation.assets）判断需要做出处理的文件类型
6. 通过 compilation.assets[name].source() 方法获取到资源内容，再处理内容
7. 再将处理之后的内容覆盖到原有的内容当中（在 source 中返回处理后的内容，在 size 中返回处理之后内容的长度）
8. 通过类型构建实例使用插件


## 编程题
### **使用 Webpack 实现 Vue 项目打包任务**
```bash
# 打包项目
yarn build

# 启动开发服务器
yarn serve
```
### **公共配置文件：webpack.common.js**
1. **mode**：`'node'`，webpack4 版本以后不设置会报警告信息
2. 入口文件：entry => `'./src/main.js'`
3. 打包目录：`'dist'`
4. **loader** ：  
   * less文件：使用 `'less-loader'` 模块解析 `'less'` 文件，在依次给 `'css-loader'` 和 `'style-loader'` 解析，此模块依赖 `'less'` 模块，否则会报错
   * 

> 开发配置设置和生产配置和使用 `'webpack-merge'` 插件合并公共配置文件中的配置：
> ```JavaScript
> const { merge } = require('webpack-merge');
> module.exports = merge(/* 引入的公共配置 */, /* 开发配置/生成配置 */)
> ```

### **开发配置：webpack.dev.js**
1. **mode**：`'development'`
2. **devtool**：`'cheap-module-eval-source-map'`，配置 source-map 模式
3. **devServer**：开发服务器相关配置
   ```JavaScript
   {
     devServer: {
      hot: true,
      open: true, // 开启服务器时是否自动打开浏览器
      contentBase: './public' // 配置静态资源访问路径
    }
   }
   ```
4. **loader** ：
   * css文件：依次使用 `'css-loader'` 和 `'style-loader'` 模块解析（如果不考虑将 css 提取为单个文件，可以设置在公共配置文件当中）
5. **plugins** ：
   * webpack.HotModuleReplacementPlugin()：配置热更新插件

### **生成配置：webpack.prod.js**
1. **mode**：`'production'`
2. **output**：给入口打包文件设置输出文件，并设置 hash
   ```JavaScript
   {
     output: {
      filename: 'bundle.[contenthash:6].js'
    }
   }
   ```
3. **loader** ：
   * css文件，先使用 `'css-loader'` 解析再交给 `'mini-css-extract-plugin'` 插件的 `'loader'` 提取为单独的 `'css'` 文件以 `'link` 的方式导入样式
    ```JavaScript
    {
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
      }
    }
    ```
4. **plugins** ：
   * `'clean-webpack-plugin'` 插件打包时清理打包文件夹
   * `'copy-webpack-plugin'` 插件将不需要做处理的文件直接拷贝到输出目录
   * `'mini-css-extract-plugin'` 插件将 css 提取为单个文件
   * `'optimize-css-assets-webpack-plugin'` 将提取出的 css 单个文件压缩，官方建议配置在 `'optimization'` 属性的 `'minimizer'` 当中（配置在这，那么打包时原本可以压缩的 js 文件会失效，因为配置了这个属性就等于是将配置压缩的功能全交给了用户自定义，所以原本默认的压缩功能就需要自定义），但是考虑到这个功能只在生成环境中使用，所以配置到了 `'plugins'` 中