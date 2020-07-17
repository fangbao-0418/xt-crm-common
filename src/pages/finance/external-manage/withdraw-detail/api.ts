const { newPost } = APP.http
export const getList = (payload: any) => {
  return newPost('/mcweb/account/withdrawal/supplier/list', payload)
}