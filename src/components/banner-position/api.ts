const { post, get } = APP.http
export function getSeatList (type:any) {
  return post(type===1?'/banner/fresh/seatList':'/banner/seatList').then((res: string) => {
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
