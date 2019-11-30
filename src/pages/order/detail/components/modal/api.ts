import { newPost } from '@/util/fetch'

/**
 * 重新提交订单报文
 * @param payload
 * mainOrderId: 主订单号
 * realName: 名字
 * realCardNo: 身份证号
 */
export function resubmit (payload: {
  reissueType: 'reissuePay' | 'reissueOrder'
  mainOrderId: number,
  realName: string,
  realCardNo: string
}) {
  return newPost('/order/globalExtend/reissueCustoms', payload)
}