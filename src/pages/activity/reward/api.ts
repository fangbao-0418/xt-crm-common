const { post, get, newPost } = APP.http

/** 获取满赠列表 */
export const fetchList = (payload: Marketing.ActivityListPayloadProps) => {
  return get('/luckydraw/getNumberList', payload)
}

/** 抽奖机会操作失效 */
export const loseEfficacy = (payload: {
  ids: any[]
  invalidReason?: string
}) => {
  return newPost('/luckydraw/operateInvalid', payload)
}