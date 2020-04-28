/*
 * @Date: 2020-04-07 10:32:36
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-22 17:42:25
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/app.js
 */

const del = require('del')
const { exec, spawn } = require('child_process')

// 发布环境
const PUB_ENV = process.env.PUB_ENV || 'dev'

del(['build/**']).then(() => {
  const build = exec('yarn build', {
    env: {
      ...process.env,
      PUB_ENV: PUB_ENV
    }
  })
  build.stdout.on('data', (data) => {
    console.log(`${data}`)
  })
  build.stderr.on('data', (data) => {
    console.log(`${data}`)
  })
})
