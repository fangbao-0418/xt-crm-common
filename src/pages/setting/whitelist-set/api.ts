const { post, get, newPost } = APP.http

export function check (payload: any) {
  return newPost('/mcweb/trade/orderConf/specialCanNotCloseQuery', payload)
}

export function submit (payload: any) {
  return newPost('/mcweb/trade/orderConf/specialCanNotCloseAdd', payload)
}