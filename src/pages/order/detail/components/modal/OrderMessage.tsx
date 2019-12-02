import React, { useMemo, useEffect } from 'react'
import { Button } from 'antd'
import * as api from './api'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form' 

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
  orderPushCustomsMsg: string
  /** 订单推送海关状态：1-未推送，2-已推送，3-处理成功，4-处理失败 */
  orderPushCustomsStatus: 1 | 2 | 3 | 4
  propstaxMoney: number
  payerRealName: string
  payerIdNumber: string
  orderPushCustomsTime: number
  hideModal: () => void
  /** 成功回调 */
  onOk: () => void
  mainOrderId: number
}
function Main (props: Props) {
  /** 是否失败 */
  const isFailed = useMemo(() => Number(props.orderPushCustomsStatus) === 4, [props.orderPushCustomsStatus])
  let form: FormInstance
  useEffect(() => {
    form && form.setValues({
      payerRealName: props.payerRealName,
      payerIdNumber: props.payerIdNumber
    })
  }, [])
  return (
    <Form
      style={{ display: props.hidden ? 'none': 'block'}}
      labelCol={{span: 8}}
      wrapperCol={{span: 10}}
      getInstance={(ref) => form = ref}
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
                const vals = form && form.getValues() || {}
                console.log('vals =>', vals)
                const data = await api.resubmit({
                  mainOrderId: props.mainOrderId,
                  reissueType: 'reissueOrder',
                  realName: vals.payerRealName,
                  realCardNo: vals.payerIdNumber
                })
                if (data) {
                  props.onOk()
                  APP.success('提交成功')
                }
              }}
            >
              重新提交
            </Button>
          </FormItem>
        )
      }
    >
      <FormItem name='orderPushCustomsStatus' type='text' label='订单报文状态'>{orderPushCustomsStatusConfig[String(props.orderPushCustomsStatus)]}</FormItem>
      <FormItem type='text'label={<span style={{fontWeight: 'bold'}}>报文申请信息</span>}></FormItem>
      <FormItem name='propstaxMoney' type='text' label='代扣税款'>{APP.fn.formatMoney(props.propstaxMoney)}</FormItem>
      <FormItem name='payerRealName' type={isFailed ? 'input' : 'text'} label='订购人姓名' />
      <FormItem name='payerIdNumber' type={isFailed ? 'input' : 'text'} label='订购人身份证号'/>
      <FormItem type='text' label={<span style={{fontWeight: 'bold'}}>报文申请结果</span>}></FormItem>
      <FormItem name='orderPushCustomsTime' type='text' label='处理时间'>{APP.fn.formatDate(props.orderPushCustomsTime)}</FormItem>
      <FormItem name='orderPushCustomsMsg' type='text' label='详细处理描述'>{props.orderPushCustomsMsg}</FormItem>
    </Form>
  )
}

export default Main