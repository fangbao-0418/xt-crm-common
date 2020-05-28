import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { namespace } from './config'
import moment from 'moment'
const { RangePicker } = DatePicker
interface PayloadProps {
  finishTime: any
  createdTime: any
  rechargeAccount: any
  rechargeOperatorOrderNo: any
  thirdPartyOrderNo: any
  rechargeType: any
  childOrderCode: any
  serialNo: any
}
interface Props extends FormComponentProps {
  className?: string
  onChange?: (value: any) => void
  export?: () => void
}

class Main extends React.Component<Props> {
  public payload: PayloadProps = APP.fn.getPayload(namespace) || {}
  public constructor (props: Props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  public handleSubmit () {
    this.props.form.validateFields((err, value: Special.SearchProps) => {
      if (err) {
        return
      }
      if (this.props.onChange) {
        this.props.onChange(value)
      }
    })
  }
  public export = () => {
  }
  public render () {
    const { getFieldDecorator } = this.props.form
    const values = this.payload
    return (
      <div
        style={{
          display: 'inline-block',
          verticalAlign: 'middle'
        }}
        className={this.props.className}
      >
        <Form layout='inline'>
          <Form.Item
            label='充值单号'
          >
            {getFieldDecorator('serialNo', { initialValue: values.serialNo })(
              <Input placeholder='请输入充值单号' />
            )}
          </Form.Item>
          <Form.Item
            label='子订单号'
          >
            {getFieldDecorator('childOrderCode', { initialValue: values.childOrderCode })(
              <Input placeholder='请输入子订单号' />
            )}
          </Form.Item>
          <Form.Item
            label='充值类型'
          >
            {getFieldDecorator('rechargeType', { initialValue: values.rechargeType })(
              <Select allowClear style={{ width: 100 }}>
                <Select.Option value={0}>全部</Select.Option>
                <Select.Option value={2}>话费</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label='三方订单号'
          >
            {getFieldDecorator('thirdPartyOrderNo', { initialValue: values.thirdPartyOrderNo })(
              <Input placeholder='请输入三方订单号' />
            )}
          </Form.Item>
          <Form.Item
            label='充值流水号'
          >
            {getFieldDecorator('rechargeOperatorOrderNo', { initialValue: values.rechargeOperatorOrderNo })(
              <Input placeholder='请输入充值流水号' />
            )}
          </Form.Item>
          <Form.Item
            label='充值账号'
          >
            {getFieldDecorator('rechargeAccount', { initialValue: values.rechargeAccount })(
              <Input placeholder='请输入充值账号' />
            )}
          </Form.Item>
          <Form.Item label='创建时间'>
            {getFieldDecorator('createdTime', { initialValue: '' })(
              <RangePicker
                style={{ width: '100%' }}
                showTime />
            )}
          </Form.Item>
          <Form.Item label='完成时间'>
            {getFieldDecorator('finishTime', { initialValue: '' })(
              <RangePicker
                style={{ width: '100%' }}
                showTime />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              style={{ marginRight: 10 }}
              type='primary'
              onClick={this.handleSubmit}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                APP.fn.setPayload(namespace, {})
                const params = {
                  finishTime: undefined,
                  createdTime: undefined,
                  rechargeAccount: undefined,
                  rechargeOperatorOrderNo: undefined,
                  thirdPartyOrderNo: undefined,
                  rechargeType: undefined,
                  childOrderCode: undefined,
                  serialNo: undefined
                }
                this.payload = params
                this.props.form.setFields(params)
                if (this.props.onChange) {
                  this.props.onChange(params)
                }
              }}
            >
              重置
            </Button>
            <Button type='primary' className='ml10' onClick={()=>{
              if (this.props.export) {
                this.props.export()
              }
            }}>
                  导出
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default Form.create({
  onValuesChange: (props, changeValues, allValues) => {
    APP.fn.setPayload(namespace, allValues)
  }
})(Main)