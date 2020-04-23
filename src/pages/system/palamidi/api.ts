/*
 * @Date: 2020-04-10 10:21:12
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-21 19:56:51
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/system/palamidi/api.ts
 */

const { newPost, post, get } = APP.http
// {"path":"/123test","mappingPath":"/345test","serviceId":"test123","apiName":"testapi","stripPrefix":0,"category":1,"appId":1000}
interface AddPayload {
  path: string
  mappingPath: string
  serviceId: string
  apiName: string
  /** 过滤 1 不过滤 0 */
  stripPrefix: string
  /** 1=C端,2=M端 */
  category: 1 | 2
  appId: string
}
export const fetcuList = (payload: any) => {
  return newPost('::palamidi/palamidi/apiRoute/getPageList/v1', payload)
}
export const add = (payload: Partial<AddPayload>) => {
  return newPost('::palamidi/palamidi/apiRoute/add/v1', payload)
}

export const edit = (payload: Partial<AddPayload>) => {
  return newPost('::palamidi/palamidi/apiRoute/update/v1', payload)
}

export const deleteRecord = (id: any) => {
  return newPost(`::palamidi/palamidi/apiRoute/delete/v1/${id}`)
}

export const getAllApp = () => {
  return get('::palamidi/palamidi/app/getAllApp/v1').then((res) => {
    return (res || []).map((item: any) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  })
}