const { post, get, newPost, newPut } = APP.http
export const getAnchorList = (payload: any) => {
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