const { post, get } = APP.http

/**
 * 1是喜团买菜
 * 2是喜团好店
 * 默认是喜团优选
 * @param type 
 */
export function getSeatList (type:any) {
  let path = '/banner/seatList'
  switch(type) {
    case 0:
      path = '/banner/seatList'
      break;
    case 10:
      path = '/banner/fresh/seatList'
      break;
    case 20:
      path = '/mcweb/pop/banner/seatList'
      break;
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
