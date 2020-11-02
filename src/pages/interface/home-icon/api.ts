const { post, get } = APP.http

export function getIconList (bizSource: string) {
  return get(`/homeicon/list?bizSource=${bizSource}`)
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