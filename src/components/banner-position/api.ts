const { post, get } = APP.http
export function getSeatList (type:any) {
  let path = ''
  if (type === 1) {
    path = '/banner/fresh/seatList'
  } else if (type === 2) {
    path = '/mcweb/pop/banner/seatList'
  } else {
    path = '/banner/seatList'
  }
  return post(path).then((res: string) => {
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
