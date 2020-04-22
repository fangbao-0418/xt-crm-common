/*
 * @Date: 2020-04-07 10:32:36
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-22 17:13:05
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/app.js
 */
const fs = require('fs')
const del = require('del')
const git = require('simple-git')
const { exec, spawn } = require('child_process')
// 发布环境
const pub_env = process.env.PUB_ENV || 'serve'
// console.log('发布环境', pub_env)

/**
 * @example  HEAD -> master, origin/master, origin/feature/v0918_aftersale_optimize, origin/HEAD
 *
 */
const getCurrBranch = function (str) {
  const b = str.split(',')[1]
  const array = b.split('/')
  return array[array.length - 1]
}

const initConfig = function () {
  const data = {
    pub_env: pub_env
  }
  return new Promise(function (resolve) {
    data.outputDir = 'build'
    git().log(function (err, b) {
      if (err) {
        throw err
      }
      // 当前版本
      console.log('当前branch版本', b.latest.refs)
      if (b.latest.refs) {
        const pubfile = pub_env === 'serve' ? '' : getCurrBranch(b.latest.refs)
        data.branch = pubfile
        if (pub_env !== 'prod' && pubfile !== 'master') {
          data.outputDir += '/' + pubfile
        }
        resolve()
      }
    })
  }).then(function () {
    // 写入配置文件
    return fs.writeFileSync('pubconfig.json', JSON.stringify(data))
  }).then(function () {
    // 删除文件目录
    return del(['build/**'])
  })
}

/**
 * vue build
 */
const reactBuild = function () {
  del(['build/**']).then(() => {
    const build = exec('npm run build', {
      env: {
        ...process.env
      }
    })
    build.stdout.on('data', (data) => {
      console.log(`${data}`)
    })
    build.stderr.on('data', (data) => {
      console.log(`${data}`)
    })
  })
}

reactBuild()
