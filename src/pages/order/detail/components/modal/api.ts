import { newPost } from '@/util/fetch'

/**
 * 重新提交订单报文
 * @param payload
 * mainOrderId: 主订单号
 * realName: 名字
 * realCardNo: 身份证号
 */
export function resubmit (payload: {
  mainOrderId: string,
  realName: string,
  realCardNo: string
}) {
  newPost('/order/globalExtend/reissueCustoms', payload)
}