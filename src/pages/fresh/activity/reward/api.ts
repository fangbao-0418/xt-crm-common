import * as Fetch from '@/util/fetch'
const { post, get, newPost } = APP.http

/** 获取满赠列表 */
export const fetchList = (payload: Marketing.ActivityListPayloadProps) => {
  return get('/mcweb/promotion/fresh/luckydraw/getNumberList', payload)
}

/** 抽奖机会操作失效 */
export const loseEfficacy = (payload: {
  ids: any[]
  invalidReason?: string
}) => {
  return newPost('/mcweb/promotion/fresh/luckydraw/operateInvalid', payload)
}
/**
 * 补发抽奖接口
 */
export function fillChance (payload: any) {
  return newPost('/mcweb/promotion/fresh/luckydraw/record/fillChance', payload)
}

/**
 * 查询达成活动记录详情
 * @param payload
 */
export function activeFinishDetail (payload: any) {
  return newPost('/member/active/finish', payload)
}

/**
 * 达成活动记录订单数据导出
 * @param payload
 */
export function activeFinishExport (payload: any) {
  return Fetch.exportFile('/member/active/export', payload)
}