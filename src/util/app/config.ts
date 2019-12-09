import { baseHost, env as apiEnv } from '../baseHost'
import * as LocalStorage from '@/util/localstorage';
type ApiEnv = 'dev' | 'test1' | 'test2' | 'pre' | 'prod';
// export function getApiEnv () {
//   const origin = LocalStorage.get('apidomain') || baseHost
//   const mapper = new Map<string, ApiEnv>([
//     ['http://daily-crm-test.hzxituan.com', 'dev'],
//     ['https://testapi-crmadmin.hzxituan.com', 'test1'],
//     ['https://test2api-crmadmin.hzxituan.com', 'test2'],
//     ['https://pre-xt-crm-api.hzxituan.com', 'pre'],
//     ['https://youxuan-crm-api.hzxituan.com', 'prod']
//   ])
//   return mapper.get(origin)
// }
// export const apiEnv = getApiEnv()

/** 后端环境接口映射 */
export const serverMapper: any = {
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
  const serverPattern = /^::(message)/
  if (/^https?/.test(url)) {
    return url
  } else if (serverPattern.test(url)) {
    const result = url.match(serverPattern)
    const servername = result && result[1] || 'default'
    const currentServerEnum: any = serverMapper[servername] || serverMapper.default
    const apiOrigin = currentServerEnum[apiEnv as any] || currentServerEnum.dev || ''
    return url.replace(serverPattern, apiOrigin)
  } else {
    return url
  }
}