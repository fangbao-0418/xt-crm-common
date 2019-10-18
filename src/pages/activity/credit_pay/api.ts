const { post, get } = APP.http
export const fetchList = () => {
  return fetch(`http://mock-ued.hzxituan.com/mock/5da1a097b62ce300168bb5d7/crm/product/huabei/get_list`).then(r => r.json())
}