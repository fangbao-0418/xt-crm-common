import React, { useMemo, useEffect } from 'react'
import { Button, Modal } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import * as api from './api'
import { idcardReg } from '@/util/regexp'

/**
 * 订单推送海关状态
 */
const paymentPushCustomsStatusConifg: any = {
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
  customsClearance: number,
  /** 支付单推送海关状态：1-未推送，2-已推送，3-处理成功，4-处理失败 */
  paymentPushCustomsStatus: 1 | 2 | 3 | 4
  paymentPushCustomsMsg: string
  /** 成功回调 */
  onOk: () => void
  /** 主订单ID */
  mainOrderId: number
  hideModal: () => void
}
function Main (props: Props) {
  /** 支付报文类型*/
  const paymentChannel = useMemo(() => props.paymentChannel === 1 ? '微信' : '支付宝', [props.paymentChannel])
  /** 是否失败 */
  const isFailed = useMemo(() => Number(props.paymentPushCustomsStatus) === 4, [props.paymentPushCustomsStatus])
  let form: FormInstance
  useEffect(() => {
    form && form.setValues({
      payerRealName: props.payerRealName,
      payerIdNumber: props.payerIdNumber
    })
  }, [])
  return (
    <Form
      getInstance={(ref) => form = ref}
      style={{ display: props.hidden ? 'none': 'block'}}
      labelCol={{span: 8}}
      wrapperCol={{span: 10}}
      addonAfter={
        (
          <FormItem
            hidden={!isFailed}
          >
            <Button
              className='mr10'
              onClick={props.hideModal}>
              取消
            </Button>
            <Button
              type='primary'
              onClick={async () => {
                Modal.confirm({
                  title: '系统提示',
                  content: '确认重新提交支付单报文',
                  onOk: async () => {
                    const vals = form && form.getValues() || {}
                    const data = await api.resubmit({
                      mainOrderId: props.mainOrderId,
                      reissueType: 'reissuePay',
                      realName: vals.payerRealName,
                      realCardNo: vals.payerIdNumber
                    })
                    if (data) {
                      props.onOk()
                      APP.success('提交成功')
                    }
                  }
                })
              }}
            >
              重新提交
            </Button>
          </FormItem>
        )
      }
    >
      <FormItem
        name='paymentChannel'
        type='text'
        label='支付单报文类型'>
        {paymentChannel}
      </FormItem>
      <FormItem
        name='paymentPushCustomsStatus'
        type='text'
        label='支付单报文状态'>
        {paymentPushCustomsStatusConifg[String(props.paymentPushCustomsStatus)]}
      </FormItem>
      <FormItem
        type='text'
        label={<span style={{fontWeight: 'bold'}}>报文申请信息</span>}
      />
      <FormItem
        name='paymentDeclareNo'
        type='text'
        label='报关流水号'>
        {props.paymentDeclareNo}
      </FormItem>
      <FormItem
        name='paymentNo'
        type='text'
        label={paymentChannel + '交易号'}>
        {props.paymentNo}
      </FormItem>
      <FormItem
        name='customsClearance'
        type='text'
        label='报关金额'>
        {APP.fn.formatMoney(props.customsClearance)}
      </FormItem>
      <FormItem
        name='payerRealName'
        type={isFailed ? 'input' : 'text'}
        label='订购人姓名'
      />
      <FormItem
        name='payerIdNumber'
        type={isFailed ? 'input' : 'text'}
        label='订购人身份证号'
        verifiable
        required={false}
        fieldDecoratorOptions={{
          rules: [{
            validator: (rule: any, value: any, callback: any) => {
              if (idcardReg.test(value)) {
                callback()
              }
              else {
                callback('请输入合法的身份证号')
              }
            }
          }]
        }}
      />
      <FormItem
        type='text'
        label={<span style={{fontWeight: 'bold'}}>报文申请结果</span>}
      />
      <FormItem
        name='paymentPushCustomsTime'
        type='text'
        label='处理时间'>
        {APP.fn.formatDate(props.paymentPushCustomsTime)}
      </FormItem>
      <FormItem
        name='paymentPushCustomsMsg'
        type='text'
        label='详细处理描述'>
        {props.paymentPushCustomsMsg}
      </FormItem>
    </Form>
  )
}
export default Main