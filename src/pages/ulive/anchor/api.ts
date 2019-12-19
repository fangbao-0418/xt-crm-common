const { post, get, newPost, newPut } = APP.http
export const getAnchorList = (payload: any) => {
  payload.status = payload.status === undefined ? 0 : payload.status 
  return get('::ulive/live/anchor/list', payload)
}
/** 获取用户信息 */
export const fetchUserInfo = (payload: {
  memberId?: number
  phone?: string
}) => {
  return Promise.all<any, any>([get('::ulive/live/anchor/member', payload), get('/member/simple', payload)])
}
export const addAnchore = (payload: Partial<Anchor.ItemProps>) => {
  // payload = {
  //   anchorIdentityType: 10,
  //   anchorLevel: 0,
  //   headUrl: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551574769147848.gif',
  //   memberId: 888889168,
  //   nickName: 'abc',
  //   phone: '18219116464',
  // }
  return newPost('::ulive/live/anchor/save', payload)
}
/** 主播状态修改(拉黑/不拉黑) */
export const updateAnchorStatus = (payload: {
  anchorId: number
  status: 0 | 1
}) => {
  return newPut('::ulive/live/anchor/status/update', payload)
}

export const updateAnchor = (payload: {
  anchorId: number
  anchorIdentityType: Anchor.AnchorIdentityType
  anchorLevel: 0 | 10
}) => {
  return newPut('::ulive/live/anchor/update', payload)
}