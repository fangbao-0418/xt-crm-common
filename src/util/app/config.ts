import { baseHost, env as apiEnv } from '../baseHost'

/** 后端环境接口映射 */
export const serverMapper: any = {
  ulive: {
    local: 'https://dailylive-center.hzxituan.com',
    dev: 'https://test01live-center.hzxituan.com',
    pre: 'https://test01live-center.hzxituan.com',
    prod: 'http://192.168.4.117:1008'
  },
  message: {
    dev: 'https://test01center-bi.hzxituan.com',
    pre: 'https://pre-center-bi.hzxituan.com',
    prod: 'https://center-bi.hzxituan.com'
  },
  default: {
    dev: 'https://daily-crm-test.hzxituan.com',
    test1: 'https://testapi-crmadmin.hzxituan.com',
    test2: 'https://test2api-crmadmin.hzxituan.com',
    pre: 'https://pre-xt-crm-api.hzxituan.com',
    prod: 'https://youxuan-crm-api.hzxituan.com'
  }
}

export function handleApiUrl (url: string) {
  const serverPattern = /^::(message|ulive)/
  if (/^https?/.test(url)) {
    return url
  } else if (serverPattern.test(url)) {
    const result = url.match(serverPattern)
    const servername = result && result[1] || 'default'
    // console.log(servername, 'servername')
    const currentServerEnum: any = serverMapper[servername] || serverMapper.default
    console.log(servername, currentServerEnum, 'currentServerEnum')
    const apiOrigin = currentServerEnum[apiEnv as any] || currentServerEnum.dev || ''
    return url.replace(serverPattern, apiOrigin)
  } else {
    return url
  }
}