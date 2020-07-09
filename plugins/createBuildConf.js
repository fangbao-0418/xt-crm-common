/*
 * @Author: fangbao
 * @Date: 2020-05-19 22:58:12
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 22:58:23
 * @FilePath: /xt-crm/pulgins/createBuildConf.js
 */

function CreateVersionPlugin (options) {
  this.options = options
}

CreateVersionPlugin.prototype.apply = function (compiler) {
  const options = this.options
  compiler.plugin('emit', function (compilation, callback) {
    
    // 将这个列表作为一个新的文件资源，插入到 webpack 构建中：
    const content = JSON.stringify(options)
    compilation.assets['pub_info'] = {
      source: function () {
        return content
      },
      size: function () {
        return content.length
      }
    }
    callback()
  })
}

module.exports = CreateVersionPlugin
