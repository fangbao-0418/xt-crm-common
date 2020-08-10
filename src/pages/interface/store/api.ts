const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
export const getAnchorList = (payload: any) => {
  if(payload.shopType===0){
    delete payload.shopType
  }
  return newPost('/mmweb/supplier/shop/V1/sort/page', payload)
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