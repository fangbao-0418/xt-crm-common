import React from 'react'
import { Form, Input, Button, Icon, Card, Radio, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Upload from '@/components/upload'
import Content from './components/content'
import * as api from './api'
import styles from './style.module.sass'
import { namespace } from './model'
interface Props extends FormComponentProps, RouteComponentProps<{id: any}> {
  detail: Special.DetailItem
}
interface State {
  loading: boolean
}
class Main extends React.Component<Props, State> {
  public state = {
    loading: false
  }
  public id = '-1'
  public constructor (props: Props) {
    super(props)
    this.addContent = this.addContent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  public componentDidMount () {
    APP.dispatch({
      type: `${namespace}/@@init`
    })
    this.fetchData()
  }
  public addContent (type: 1 | 2 | 3) {
    const { detail } = this.props
    detail.list.push({
      type,
      sort: 0,
      list: []
    })
    APP.dispatch({
      type: `${namespace}/changeDetail`,
      payload: {...detail}
    })
  }
  public fetchData() {
    const id = this.props.match.params.id
    this.id = id
    if (id === '-1') {
      return
    }
    APP.dispatch({
      type: `${namespace}/fetchDetail`,
      payload: {
        id,
        cb: (res: Special.DetailItem) => {
          if (typeof res.imgUrl === 'string') {
            res.imgUrl = [
              {
                uid: 'imgUrl0',
                url: res.imgUrl
              }
            ]
          }
          this.props.form.setFieldsValue(res)
        }
      }
    })
  }
  public handleSubmit (e: any) {
    e.preventDefault()
    this.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      const detail = this.props.detail
      this.setState({
        loading: true
      })
      if (value.imgUrl instanceof Array) {
        value.imgUrl = value.imgUrl[0] && value.imgUrl[0].url
      }
      api.saveSpecial({
        ...detail,
        ...value
      }).then((res: any) => {
        if (res !== undefined) {
          APP.success(`专题${this.id === '-1' ? '新增' : '修改'}成功`)
          APP.history.push('/interface/special')
        }
      }).finally(() => {
        this.setState({
          loading: false
        })
      })
    })
  }
  public render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
    };
    return (
      <div className={styles.detail}>
        <div className={styles.content}>
          <Form
            className={styles.form}
            {...formItemLayout}
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              label='名称'
            >
              {getFieldDecorator('subjectName', {
                rules: [
                  {required: true, message: '名称不能为空'}
                ]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='分享标题'
            >
              {getFieldDecorator('shareTitle', {
                rules: [
                  {required: true, message: '分享标题不能为空'},
                  {
                    max: 30,
                    message: '分享标题不能超过30个字符'
                  }
                ]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='专题背景色'
            >
              {getFieldDecorator('backgroundColor', {
                initialValue: '#FFFFFF',
                rules: [
                  {required: true, message: '专题背景色不能为空'}
                ]
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='banner图片'
              required
            >
              {getFieldDecorator('imgUrl', {
                rules: [{
                  required: true,
                  message: 'banner图片不能为空'
                }]
              })(
                <Upload
                  size={0.3}
                  listType="picture-card"
                >
                </Upload>
              )}
            </Form.Item>
            <Form.Item
              label='添加楼层'
            >
              <Button
                type="primary"
                className={styles.mr10}
                onClick={() => this.addContent(3)}
              >
                广告
              </Button>
              {/* <Button type="primary" className={styles.mr10}>优惠券</Button> */}
              <Button
                type="primary"
                onClick={() => this.addContent(1)}
              >
                商品
              </Button>
            </Form.Item>
            <Content />
            <div className={styles.footer}>
              <Button
                loading={this.state.loading}
                type="primary"
                htmlType="submit"
                style={{marginRight: 20}}
              >
                保存
              </Button>
              <Button
                onClick={() => {
                  APP.history.push('/interface/special')
                }}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(connect((state: any) => {
  return {
    detail: state[namespace].detail
  }
})(withRouter(Main)))
