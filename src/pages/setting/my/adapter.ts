import { replaceHttpUrl, removeURLDomain, initImgList } from '@/util/utils'

/**
 * 处理新增入参
 * @param payload 
 */
export function handleIconRequestParams (payload: My.iconApiPayload) {
  const result = Object.assign({}, payload)
  console.log('handleIconRequestParams before=>', payload)
  result.iconUrl = result.iconUrl && result.iconUrl[0] && removeURLDomain(result.iconUrl[0].url)
  result.memberTypes = (result.memberTypes || []).join(',')
  const platformCodes = result.platformCodes || []
  result.platformCodes = (platformCodes.includes('2') ? platformCodes.concat('1') : platformCodes).join(',')
  console.log('handleIconRequestParams after=>', result)
  return result
}

/**
 * 处理查询个人中心配置详情响应结果
 * @param res 
 */
export function handleQueryVersionDetailResponse (res: any) {
  console.log('handleQueryVersionDetailResponse before=>', res)
  const result = (res || []).map((v: any) => {
    return {
      ...v,
      iconUrl: replaceHttpUrl(v.iconUrl)
    }
  })
  console.log('handleQueryVersionDetailResponse after=>', result)
  return result
}

/**
 * 处理表单数据
 * @param config
 */
export function handleFormData (config: any) {
  const result = Object.assign({}, config)
  result.iconUrl = initImgList(result.iconUrl)
  const platformCodes = result.platformCodes || ''
  result.platformCodes = platformCodes.split(',').filter((v: string) => v !== '1')
  result.memberTypes = (result.memberTypes || '').split(',')
  console.log('handleFormData=>', result)
  return result
}