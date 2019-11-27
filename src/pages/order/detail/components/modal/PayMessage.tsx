import React from 'react'
import Form, { FormItem } from '@/packages/common/components/form' 

interface Props {
  hidden?: boolean
}
function Main (props: Props) {
  return (
    <Form
      style={{ display: props.hidden ? 'none': 'block'}}
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
    >
      <FormItem type='text' label='支付单报文类型'>支付宝</FormItem>
      <FormItem type='text' label='支付单报文状态'>申报中/申报成功</FormItem>
      <FormItem type='text' label='报文申请信息'></FormItem>
      <FormItem type='text' label='报关流水号'>9193457120563834</FormItem>
      <FormItem type='text' label='支付宝交易号'>2015051446800462000100020003</FormItem>
      <FormItem type='text' label='报关金额'>2.00</FormItem>
      <FormItem type='text' label='订购人姓名'>张三</FormItem>
      <FormItem type='text' label='订购人身份证号'>230227198707201827</FormItem>
      <FormItem type='text' label='报文申请结果'></FormItem>
      <FormItem type='text' label='业务结果'>申报成功</FormItem>
      <FormItem type='text' label='处理时间'>2010.09.09 18:00:00</FormItem>
    </Form>
  )
}
export default Main