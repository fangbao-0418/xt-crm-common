import React from 'react'
import { Button } from 'antd'
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
  hidden?: boolean
  paymentChannel: 1 | 2,
  paymentDeclareNo: number
  payerRealName: string
  payerIdNumber: string
  paymentPushCustomsTime: number
  paymentNo: string
  taxMoney: number,
  paymentPushCustomsStatus: 1 | 2 | 3 | 4
  paymentPushCustomsMsg: string
}
function Main (props: Props) {
  const paymentChannel = props.paymentChannel === 1 ? '支付宝' : '微信'
  return (
    <Form
      style={{ display: props.hidden ? 'none': 'block'}}
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      addonAfter={
        (
          <FormItem
            formItemProps={{
              wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }
            }}
          >
            <Button className='mr10'>取消</Button>
            <Button type='primary' htmlType='submit'>重新提交</Button>
          </FormItem>
        )
      }
    >
      <FormItem type='text' label='支付单报文类型'>{paymentChannel}</FormItem>
      <FormItem type='text' label='支付单报文状态'>{orderPushCustomsStatusConfig[String(props.paymentPushCustomsStatus)]}</FormItem>
      <FormItem type='text' label='报文申请信息'></FormItem>
      <FormItem type='text' label='报关流水号'>{props.paymentDeclareNo}</FormItem>
      <FormItem type='text' label={paymentChannel + '交易号'}>{props.paymentNo}</FormItem>
      <FormItem type='text' label='报关金额'>{APP.fn.formatMoney(props.taxMoney)}</FormItem>
      <FormItem type='text' label='订购人姓名'>{props.payerRealName}</FormItem>
      <FormItem type='text' label='订购人身份证号'>{props.payerIdNumber}</FormItem>
      <FormItem type='text' label='报文申请结果'></FormItem>
      <FormItem type='text' label='处理时间'>{APP.fn.formatDate(props.paymentPushCustomsTime)}</FormItem>
      <FormItem type='text' label='详细处理描述'>{props.paymentPushCustomsMsg}</FormItem>
    </Form>
  )
}
export default Main