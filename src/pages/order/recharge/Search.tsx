import React from 'react'
import { Form, Input, Button, Select, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BannerPosition from '@/components/banner-position'
import { namespace } from './config'
import moment from 'moment'
const { RangePicker } = DatePicker
interface PayloadProps {
  title?: string
  seat?: any[]
  status?: number
}
interface Props extends FormComponentProps {
  className?: string
  onChange?: (value: any) => void
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
        value.status = [0, 1].indexOf(value.status as number) === -1 ? undefined : value.status
        value.seat = value.seat || []
        value.newSeat = value.seat[0]
        value.childSeat = value.seat[1]
        delete value.seat
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
            {getFieldDecorator('title', { initialValue: values.title })(
              <Input placeholder='请输入充值单号' />
            )}
          </Form.Item>
          <Form.Item
            label='子订单号'
          >
            {getFieldDecorator('titlqe', { initialValue: values.title })(
              <Input placeholder='请输入子订单号' />
            )}
          </Form.Item>
          <Form.Item
            label='充值类型'
          >
            {getFieldDecorator('status', { initialValue: values.status })(
              <Select allowClear style={{ width: 100 }}>
                <Select.Option value={0}>全部</Select.Option>
                <Select.Option value={1}>话费</Select.Option>
                <Select.Option value={2}>流量</Select.Option>
                <Select.Option value={3}>游戏卡</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label='三方订单号'
          >
            {getFieldDecorator('tiwtlqe', { initialValue: values.title })(
              <Input placeholder='请输入三方订单号' />
            )}
          </Form.Item>
          <Form.Item
            label='充值流水号'
          >
            {getFieldDecorator('titldqe', { initialValue: values.title })(
              <Input placeholder='请输入充值流水号' />
            )}
          </Form.Item>
          <Form.Item
            label='充值账号'
          >
            {getFieldDecorator('titdlqe', { initialValue: values.title })(
              <Input placeholder='请输入充值账号' />
            )}
          </Form.Item>
          <Form.Item label='创建时间'>
            {getFieldDecorator('creatdeTime', { initialValue: '' })(
              <RangePicker
                style={{ width: '100%' }}
                format='YYYY-MM-DD HH:mm'
              />
            )}
          </Form.Item>
          <Form.Item label='完成时间'>
            {getFieldDecorator('createTime', { initialValue: '' })(
              <RangePicker
                style={{ width: '100%' }}
                format='YYYY-MM-DD HH:mm'
              />
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
                this.payload = {}
                APP.fn.setPayload(namespace, {})
                const params = {
                  title: undefined,
                  seat: undefined,
                  status: undefined
                }
                this.props.form.setFields(params)
                if (this.props.onChange) {
                  this.props.onChange(params)
                }
              }}
            >
              重置
            </Button>
            <Button type='primary' className='ml10' onClick={this.export}>
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