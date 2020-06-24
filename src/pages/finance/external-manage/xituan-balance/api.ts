const { post, get, newPost } = APP.http
//供应商提现列表
export const getList = () => {
  return get('/mcweb/account/withdrawal/list')
}
//平台发送提现确认短信
export const platformSend = () => {
  return get('/mcweb/account/sms/send/platform')
}
//平台提现申请
export const apply = (value: any) => {
  return newPost('/mcweb/account/platform/withdrawal/apply', value)
}
//查询平台余额
export const platformBalance = () => {
  return get('/mcweb/account/balance/platformBalance')
}