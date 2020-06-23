const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
export const getAnchorList = (payload: any) => {
  return get('::ulive/live/anchor/list', payload)
}
//供应商提现列表
export const getList = () => {
  return get('/mcweb/supplier/withdrawal/list')
}
//平台发送提现确认短信
export const platformSend = () => {
  return get('/mcweb/supplier/sms/send/platform')
}
//平台提现申请
export const apply = () => {
  return post('/mcweb/supplier/withdrawal/platform/apply', apply)
}