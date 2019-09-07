import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import classNames from 'classnames'
import { FormComponentProps } from 'antd/lib/form'
import styles from './style.module.sass'
interface Props extends FormComponentProps {
  className?: string
  onChange?: (value?: Special.SearchProps) => void
}
const namespace = '/special/list'
class Main extends React.Component<Props> {
  public payload: Special.SearchProps = APP.fn.getPayload(namespace) || {}
  public constructor (props: Props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  public handleSubmit () {
    this.props.form.validateFields((err, value: Special.SearchProps) => {
      if (this.props.onChange) {
        console.log(value, 'value')
        value.status = [0, 1].indexOf(value.status as number) === -1 ? undefined : value.status
        this.props.onChange(value)
      }
    })
  }
  public render () {
    const { getFieldDecorator } = this.props.form
    const values = this.payload
    return (
      <div className={classNames(styles.search, this.props.className)}>
        <Form
          layout="inline"
        >
          <Form.Item
            label='专题ID'
          >
            {
              getFieldDecorator('subjectId', {initialValue: values.subjectId})(
                <Input placeholder='请输入专题ID'/>
              )
            }
          </Form.Item>
          <Form.Item
            label='专题名称'
          >
            {
              getFieldDecorator('title', {initialValue: values.title})(
                <Input  placeholder='请输入专题名称' />
              )
            }
          </Form.Item>
          <Form.Item
            label='状态'
          >
            {
              getFieldDecorator('status', {
                initialValue: values.status !== undefined ? values.status : -1
              })(
                <Select style={{width: 100}}>
                  <Select.Option value={-1}>全部</Select.Option>
                  <Select.Option value={1}>生效</Select.Option>
                  <Select.Option value={0}>已失效</Select.Option>
                </Select>
              )
            }
          </Form.Item>
          <Form.Item>
            <Button
              style={{marginRight: 10}}
              type="primary"
              onClick={this.handleSubmit}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                this.payload = {}
                APP.fn.setPayload(namespace, {})
                this.props.form.resetFields()
                this.forceUpdate()
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
export default Form.create<Props>({
  onValuesChange: (props, changeValues, allValues) => {
    APP.fn.setPayload(namespace, allValues)
  }
})(Main)