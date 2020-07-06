/*
 * @Date: 2020-04-21 15:44:12
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-22 13:42:34
 * @FilePath: /xt-wms/build.js
 */

const argv = require('yargs').argv
const { exec, execSync, spawn } = require('child_process')

const env = argv.env || 'dev'

const build = exec('node --max-old-space-size=14096 ./node_modules/xt-crm-cli/lib/scripts/build.js', {
  env: {
    ...process.env,
    NODE_ENV: env
  }
})

build.stdout.on('data', (data) => {
  console.log(`${data}`)
})

build.stderr.on('data', (data) => {
  console.log(`${data}`)
})
