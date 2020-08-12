import { IntegralListPayloadProps } from './interface'
const { get, newPost } = APP.http

export const fetchList = (payload: Partial<IntegralListPayloadProps>) => {
  return newPost('/mcweb/account/point/query', payload)
}