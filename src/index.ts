import bootstrap from '@xt-micro-service/bootstrap'
import injectConfigs from '@/packages/portal/src/config'
const config = injectConfigs.filter((item) => item.path !== '/')
config.push({
  serverName: 'common',
  path: '/',
  css: [],
  js: []
})
const app = bootstrap(config, {
  baseUrl: process.env.IS_LOCAL && 'http://daily-xt-crmadmin.hzxituan.com'
})
app.start()
