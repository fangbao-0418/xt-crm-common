import React from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import * as api from './api'
interface Props extends FormComponentProps {}
interface State {
  title: string
}
class Main extends React.Component<Props, State> {
  public state: State = {
    title: ''
  }
  public constructor (props: Props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  public componentDidMount () {
    api.getHomeTitle().then((res: any) => {
      this.setState({
        title: res
      })
    })
  }
  public onSubmit () {
    this.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      api.editHomeTitle(value.title).then(() => {
        APP.success('保存成功')
      })
    })
  }
  public render () {
    const { getFieldDecorator } = this.props.form
    const { title } = this.state
    return (
      <div
        style={{
          background: '#FFFFFF',
          padding: 20,
          minHeight: 400
        }}
      >
        <Form
          style={{
            width: 500,
            margin: '0 auto'
          }}
          labelCol={{
            span: 4
          }}
          wrapperCol={{
            span: 20
          }}
          onSubmit={this.onSubmit}
        >
          <Form.Item
            label='标题'
          >
            {
              getFieldDecorator('title', {
                initialValue: title,
                rules: [{
                  required: true,
                  message: '标题不能为空'
                }]
              })(
                <Input placeholder="请输入标题" />
              )
            }
          </Form.Item>
          <Row
          >
            <Col span={4}></Col>
            <Col span={29}>
              <Button
                type="primary"
                htmlType="submit"
              >
                保存
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
export default Form.create()(Main)