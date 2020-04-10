/*
 * @Date: 2020-03-27 13:45:49
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-10 10:27:42
 * @FilePath: /xt-crm/src/util/app/config.ts
 */
import { baseHost, env as apiEnv } from '../baseHost'

/** 后端环境接口映射 */
export const serverMapper: any = {
  palamidi: {
    dev: 'http://daily-palamidi-console.hzxituan.com'
  },
  ulive: {
    dev: 'https://dailylive-center.hzxituan.com',
    test1: 'https://test01live-center.hzxituan.com',
    test2: 'https://test01live-center.hzxituan.com',
    pre: 'https://pre-live-center.hzxituan.com',
    prod: 'https://live-center.hzxituan.com'
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
  const serverPattern = /^::(message|ulive|palamidi)/
  if ((/^https?/).test(url)) {
    return url
  } else if (serverPattern.test(url)) {
    const result = url.match(serverPattern)
    const servername = result && result[1] || 'default'
    // console.log(servername, 'servername')
    const currentServerEnum: any = serverMapper[servername] || serverMapper.default
    // console.log(servername, currentServerEnum, 'currentServerEnum')
    const apiOrigin = currentServerEnum[apiEnv as any] || currentServerEnum.dev || ''
    return url.replace(serverPattern, apiOrigin)
  } else {
    return url
  }
}