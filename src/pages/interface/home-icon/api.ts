const { post, get } = APP.http

export function getIconList () {
  return get('/homeicon/list')
}

export function saveIcon (payload: HomeIcon.ItemProps) {
  return post('/homeicon/update', payload)
}

export function addIcon (payload: HomeIcon.ItemProps) {
  return post('/homeicon/add', payload)
}

export function deleteIcon (id: any) {
  return post(`/homeicon/delete?id=${id}`)
}

export function publishIcon () {
  return post('/homeicon/publish')
}