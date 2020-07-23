import { replaceHttpUrl, removeURLDomain, initImgList } from '@/util/utils'

/**
 * 处理新增入参
 * @param payload 
 */
export function handleIconRequestParams (payload: My.iconApiPayload) {
  const result = Object.assign({}, payload)
  console.log('handleIconRequestParams before=>', payload)
  result.iconUrl = result.iconUrl && result.iconUrl[0] && removeURLDomain(result.iconUrl[0].url)
  const platformCodes = result.platformCodes || []
  const memberTypes = result.memberTypes || []
  /** 1 2 微信平台/h5，如果勾选h5默认补充微信平台h5 */
  result.platformCodes = (platformCodes.includes('2') ? platformCodes.concat('1') : platformCodes).join(',')
  result.memberTypes = memberTypes.join && memberTypes.join(',')
  return result
}

/**
 * 处理查询个人中心配置详情响应结果
 * @param res 
 */
export function handleQueryVersionDetailResponse (res: any) {
  const myHeadIcons = (res?.myHeadIcons || []).map((v: any) => {
    return {
      ...v,
      iconUrl: replaceHttpUrl(v.iconUrl)
    }
  })
  const myBottomIcons = (res?.myBottomIcons || []).map((v: any) => {
    return {
      ...v,
      iconUrl: replaceHttpUrl(v.iconUrl)
    }
  })
  return {
    myHeadIcons,
    myBottomIcons
  }
}

/**
 * 处理表单数据
 * @param config
 */
export function handleFormData (config: any) {
  const result = Object.assign({}, config)
  result.iconUrl = initImgList(result.iconUrl)
  const platformCodes = (result.platformCodes || '').split(',').filter((v: string) => v !== '1')
  const memberTypes = (result.memberTypes || '').split(',')
  /** 如果显示端口/显示用户都勾选了默认添加all */
  result.platformCodes = platformCodes.length === 4 ? platformCodes.concat(['all']) : platformCodes
  result.memberTypes = memberTypes.length === 5 ? memberTypes.concat(['all']) : memberTypes
  console.log('handleFormData=>', result)
  return result
}