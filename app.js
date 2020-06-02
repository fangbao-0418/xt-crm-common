/*
 * @Date: 2020-05-13 10:35:19
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-02 11:06:24
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/app.js
 */
const del = require('del')
const { exec, spawn } = require('child_process')

// 发布环境
const PUB_ENV = process.env.PUB_ENV || 'dev'

del(['build/**']).then(() => {
  const build = exec('yarn build', {
    env: {
      ...process.env,
      PUB_ENV: PUB_ENV,
      GENERATE_SOURCEMAP: false
    }
  })
  build.stdout.on('data', (data) => {
    console.log(`${data}`)
  })
  build.stderr.on('data', (data) => {
    console.log(`${data}`)
  })
})
