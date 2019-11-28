import React from 'react'
import Form, { FormItem } from '@/packages/common/components/form' 

interface Props {
  hidden?: boolean,
  orderPushCustomsMsg: string
}
function Main (props: Props) {
  return (
    <Form
      style={{ display: props.hidden ? 'none': 'block'}}
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
    >
      <FormItem type='text' label='支付单报文状态'>{props.orderPushCustomsMsg}</FormItem>
      <FormItem type='text' label='报文申请信息'>{}</FormItem>
      <FormItem type='text' label='代扣税款'>2.00</FormItem>
      <FormItem type='text' label='订购人姓名'>张三</FormItem>
      <FormItem type='text' label='订购人身份证号'>230227198707201827</FormItem>
      <FormItem type='text' label='报文申请结果'></FormItem>
      <FormItem type='text' label='业务结果'>申报成功</FormItem>
      <FormItem type='text' label='处理时间'>2010.09.09 18:00:00</FormItem>
      <FormItem type='text' label='详细错误描述'>同一笔交易同一个海关只能报关一次</FormItem>
      <FormItem type='text' label='和支付人身份信息的验证结果'>一致/不一致</FormItem>
    </Form>
  )
}

export default Main