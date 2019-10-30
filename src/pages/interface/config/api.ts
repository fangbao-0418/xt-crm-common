const { get, post, newPost } = APP.http

// 获取首页标题
export function getHomeTitle () {
  return get('/crm/home/getTitle')
}

// 设置首页标题
export function editHomeTitle (title: string) {
  return get(`/crm/home/title?title=${title}`)
}
// 设置首页样式
export function editHomeStyle (data: any) {
  return newPost(`/crm/home/style`, data)
}

// 获取首页样式
export function getHomeStyle () {
  return get('/crm/home/style')
}