const { post, get } = APP.http
export function getSeatList () {
  return post(`/banner/seatList`).then((res: string) => {
    return JSON.parse(res)
  })
}
export function getCategory (payload = {
  status: 0,
  pageNo: 1,
  pageSize: 200
}) {
  return get('/category/menu', payload)
}
