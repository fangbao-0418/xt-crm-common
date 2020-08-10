import { IntegralListPayloadProps } from './interface'
const { get, newPost } = APP.http

export const fetchList = (payload: Partial<IntegralListPayloadProps>) => {
  return get('/ncweb/account/integral/query', payload)
}