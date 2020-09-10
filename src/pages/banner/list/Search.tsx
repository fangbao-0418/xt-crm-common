import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BannerPosition from '@/components/banner-position'
import { namespace } from '../config'

interface PayloadProps {
  title?: string
  seat?: any[]
  status?: number
  bizSource?: number
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
            label='banner名称'
          >
            {getFieldDecorator('title', { initialValue: values.title })(
              <Input placeholder='请输入banner名称' />
            )}
          </Form.Item>
          <Form.Item
            label='位置'
          >
            {getFieldDecorator('seat', { initialValue: values.seat })(
              <BannerPosition />
            )}
          </Form.Item>
          <Form.Item
            label='状态'
          >
            {getFieldDecorator('status', { initialValue: values.status })(
              <Select placeholder='请选择状态' allowClear style={{ width: 172 }}>
                <Select.Option value={1}>开启</Select.Option>
                <Select.Option value={0}>关闭</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label='banner渠道'
          >
            {getFieldDecorator('bizSource', { initialValue: values.bizSource })(
              <Select placeholder='请选择banner渠道' allowClear style={{ width: 172 }}>
                <Select.Option value={-1}>全部</Select.Option>
                <Select.Option value={0}>喜团优选</Select.Option>
                <Select.Option value={20}>喜团好店</Select.Option>
              </Select>
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