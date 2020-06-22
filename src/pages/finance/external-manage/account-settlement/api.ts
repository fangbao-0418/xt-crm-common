const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
export const getAnchorList = (payload: any) => {
  return get('::ulive/live/anchor/list', payload)
}