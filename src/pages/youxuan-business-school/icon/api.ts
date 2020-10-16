const { post, get } = APP.http

// 业务源:0-优选，10-买菜，20-好店,21-优选商学院，22-好店商学院
export function getIconList () {
  return get('/mcweb/homeicon/list?bizSource=22')
}

export function saveIcon (payload: HomeIcon.ItemProps) {
  return post('/mcweb/homeicon/update', payload)
}

export function addIcon (payload: HomeIcon.ItemProps) {
  return post('/mcweb/homeicon/add?bizSource=22', payload)
}

export function deleteIcon (id: any) {
  return post(`/mcweb/homeicon/delete?id=${id}`)
}

export function publishIcon () {
  return post('/mcweb/homeicon/publish')
}