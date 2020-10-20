const { post, get, newPost, newPut, del } = APP.http
export const getAnchorList = (payload: any) => {
  return get('::ulive/live/anchor/list', payload)
}

/** 获取外部账务流水 */
export const fetchList = (payload: {
  startTime: number
  endTime: number
  /** 处理状态，-1=记账失败 0=待记账 1=记账成功 */
  processStatus: -1 | 0 | 1
  /** 收支类型，1=收入 2=支出 */
  inOrOutType: 1 | 2
  /** 账务结算对象名称 */
  subjectName: string
  /** 账务对象类型 */
  subjectType: number
  /** 账务结算ID */
  id: any
  /** 账务对象ID */
  subjectId: any
}) => {
  return newPost('/mcweb/account/financial/disposable/out/flow/list/v1', payload)
}