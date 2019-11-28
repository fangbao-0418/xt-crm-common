import React from 'react'
import Form, { FormItem } from '@/packages/common/components/form' 

/**
 * 订单推送海关状态
 */
const orderPushCustomsStatusConfig: any = {
  '1': '未推送',
  '2': '已推送',
  '3': '处理成功',
  '4': '处理失败'
}
interface Props {
  hidden?: boolean,
  orderPushCustomsMsg: string,
  orderPushCustomsStatus: 1 | 2 | 3 | 4
  propstaxMoney: number
  payerRealName: string
  payerIdNumber: string
  orderPushCustomsTime: number
}
function Main (props: Props) {
  return (
    <Form
      style={{ display: props.hidden ? 'none': 'block'}}
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
    >
      <FormItem type='text' label='支付单报文状态'>{orderPushCustomsStatusConfig[String(props.orderPushCustomsStatus)]}</FormItem>
      <FormItem type='text' label='报文申请信息'></FormItem>
      <FormItem type='text' label='代扣税款'>{APP.fn.formatMoney(props.propstaxMoney)}</FormItem>
      <FormItem type='text' label='订购人姓名'>{props.payerRealName}</FormItem>
      <FormItem type='text' label='订购人身份证号'>{props.payerIdNumber}</FormItem>
      <FormItem type='text' label='报文申请结果'></FormItem>
      <FormItem type='text' label='处理时间'>{APP.fn.formatDate(props.orderPushCustomsTime)}</FormItem>
      <FormItem type='text' label='详细处理描述'>{props.orderPushCustomsMsg}</FormItem>
    </Form>
  )
}

export default Main