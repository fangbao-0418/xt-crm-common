import { IntegralListPayloadProps } from './interface'
const { get, newPost } = APP.http

export const fetchList = (payload: Partial<IntegralListPayloadProps>) => {
  return get('/mcweb/account/point/query', payload)
}