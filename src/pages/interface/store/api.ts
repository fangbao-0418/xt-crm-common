const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
export const getAnchorList = (payload: any) => {
  return newPost('/mmweb/supplier/shop/V1/sort/page', payload)
}

export const searchfuzzy = (payload: any) => {
  return newPost(`/mmweb/supplier/shop/V1/fuzzy/query`,payload).then((res) => {
    return res.map((v: { shopName: string, shopId: string }) => ({ text: v.shopName, value: v.shopId }))
  })
}
export const ranking = (payload: any) => {
  return newPost('/mmweb/supplier/shop/V1/top/ranking', payload)
}