const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
export const getAnchorList = (payload: any) => {
  return get('::ulive/live/anchor/list', payload)
}

/** 自提点模糊搜索 */
export const searchPoints = (keyWords: string) => {
  return get(`/point/list?name=${keyWords}`).then((res) => {
    return res.result.map((v: { name: string, id: string }) => ({ text: v.name, value: v.id }))
  })
}
