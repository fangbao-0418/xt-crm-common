/*
 * @Date: 2020-03-31 10:28:14
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-10 15:32:34
 * @FilePath: /xt-crm/src/util/app/http.d.ts
 */
interface HttpProps {
  get: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  post: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  newPost: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  del: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  put: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  newPut: <T = any>(url: string, data?: any, config?: any) => Promise<T>
}