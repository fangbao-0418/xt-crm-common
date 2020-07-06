const argv = require('yargs').argv
const { exec, execSync, spawn } = require('child_process')

const env = argv.env || 'dev'

const build = exec('yarn clear && yarn submodule && node --max-old-space-size=4096 ./node_modules/xt-crm-cli/lib/scripts/build.js', {
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
