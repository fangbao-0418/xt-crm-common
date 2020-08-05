const { newPost, get, post } = APP.http

export const getList = (payload: any) => {
  return newPost('/mcweb/account/withdrawal/supplier/list', payload)
}
//发票审核列表
export const getInvoiceList = (payload: any) => {
  return newPost('/mcweb/account/supplier/invoice/list/v1', payload)
}
//发票审核详情
export const getInvoiceDetail = (payload: any) => {
  return get('/mcweb/account/supplier/invoice/detail/v1', payload)
}
//发票审核
export const auditInvoice = (payload: any) => {
  return newPost('/mcweb/account/supplier/invoice/audit/v1', payload)
}
/** 模糊查询供应商信息 */
export const searchSupplier = (keyWords: string) => {
  return post(`/mcweb/account/supplier/settlement/name/like/v1?supplierName=${keyWords}`).then((res) => {
    return res.list.map((v: { name: string, id: string }) => ({ text: v.name, value: v.id }))
  })
}