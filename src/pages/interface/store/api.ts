const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
export const getAnchorList = (payload: any) => {
  if(payload.shopType===0){
    delete payload.shopType
  }
  if (payload.bizSource !== '20') {
    return newPost('/mmweb/supplier/shop/V1/sort/page', {
      ...payload
    })
  } else {
    return newPost('/mmweb/pop/query/sort/v1', {
      ...payload,
      bizType: 2,
      bizSource: undefined
    })
  }
}

export const searchfuzzy = (payload: any) => {
  if(payload.shopType===0){
    delete payload.shopType
  }
  return newPost(`/mmweb/supplier/shop/V1/fuzzy/query`,payload).then((res) => {
    return res.map((v: { shopName: string, shopId: string }) => ({ text: v.shopName, value: v.shopId }))
  })
}

export const ranking = (payload: any) => {
  return newPost('/mmweb/supplier/shop/V1/top/ranking', payload)
}

/** 好店设置权重 */
export const newSetRanking = (payload: {
  shopId: any
  bizSort: any
}) => {
  return newPost('/mmweb/pop/editSort/v1', {
    ...payload,
    bizType: 4
  })
}


// 获取店铺类型
export function getShopTypes () {
  return get('/shop/v1/query/type').then((res: any) => {
    res.splice(0, 0, {code: 0, tag: "全部"})
    return (res || []).map((item: { tag: any; code: any }) => {
      return {
        label: item.tag,
        value: item.code
      }
    })
  })
}