const { get } = APP.http
export function getHomeTitle () {
  return get('/crm/home/getTitle')
}

export function editHomeTitle (title: string) {
  return get(`/crm/home/title?title=${title}`)
}