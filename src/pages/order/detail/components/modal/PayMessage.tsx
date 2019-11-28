import React from 'react'
import Form, { FormItem } from '@/packages/common/components/form' 

interface Props {
  hidden?: boolean
  paymentChannel: 1 | 2,
  paymentPushCustomsMsg: string
  paymentDeclareNo: number
  payerRealName: string
  payerIdNumber: string
  lastUpdateTime: number
}
function Main (props: Props) {
  return (
    <Form
      style={{ display: props.hidden ? 'none': 'block'}}
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
    >
      <FormItem type='text' label='支付单报文类型'>{props.paymentChannel === 1 ? '支付宝' : '微信'}</FormItem>
      <FormItem type='text' label='支付单报文状态'>{props.paymentPushCustomsMsg}</FormItem>
      <FormItem type='text' label='报文申请信息'></FormItem>
      <FormItem type='text' label='报关流水号'>{props.paymentDeclareNo}</FormItem>
      <FormItem type='text' label='支付宝交易号'></FormItem>
      <FormItem type='text' label='报关金额'></FormItem>
      <FormItem type='text' label='订购人姓名'>{props.payerRealName}</FormItem>
      <FormItem type='text' label='订购人身份证号'>{props.payerIdNumber}</FormItem>
      <FormItem type='text' label='报文申请结果'></FormItem>
      <FormItem type='text' label='业务结果'></FormItem>
      <FormItem type='text' label='处理时间'>{APP.fn.formatDate(props.lastUpdateTime)}</FormItem>
    </Form>
  )
}
export default Main