import React from 'react'
import { Form, FormItem, If } from '@/packages/common/components'
import { FormInstance } from '@/packages/common/components/form'
import { Button, Row, Col } from 'antd'
import * as api from '../api'
import { getFieldsConfig } from '../config'
interface Props {
  /** 1-新增 2-修改 3-拉黑操作 */
  type: 1 | 2 | 3
  hide?: () => void
  detail?: Anchor.ItemProps
  refresh?: () => void
}
interface State {
  type: number
  message: string
}

interface UserInfo {
  headImage: string
  nickName: string
  phone: string
  id: number
}

class Main extends React.Component<Props, State> {
  public form: FormInstance
  public userInfo: UserInfo
  public anchorInfo: Anchor.ItemProps | undefined = this.props.detail
  public state: State = {
    type: this.props.type,
    message: ''
  }
  public componentDidMount () {
    this.init()
  }
  public init (detail = this.props.detail) {
    if (detail) {
      this.setValue(
        detail
      )
    } else {
      this.setValue({
        nickName: '',
        phone: ''
      })
    }
  }
  public hide () {
    if (this.props.hide) {
      this.props.hide()
    }
  }
  public searchUser () {
    this.form.props.form.validateFields((err, value) => {
      if (!value.phone && !value.memberId) {
        APP.error('请输入用户手机号或登录ID')
        return
      }
      api.fetchUserInfo(value).then((res) => {
        const [info1, info2] = res
        this.userInfo = info2
        this.anchorInfo = info1
        let message = ''
        const result = {
          nickName: info2 && info2.nickName,
          phone: info2 && info2.phone,
          ...info1,
        }
        if (info2) {
          if (info1) {
            // 黑名单用户
            if (info1.status === 1) {
              message = '该用户是黑名单用户！'
            }
            // 用户主播身份为公司
            else if (info1.anchorIdentityType === 10) {
              this.setState({
                type: 5
              }, () => {
                this.setValue(result)
              })
              return
            }
          }
          if (!info1 && info2.authStatus !== 1) {
            message = '该用户未进行实名认证，不允许添加为主播！'
          }
          if (message) {
            this.setState({
              message,
              type: 4
            }, () => {
              this.setValue(result)
            })
            return
          }
          if (info1) {
            message = '该用户已是平台主播，你可以调整其等级/身份！'
          }
          this.setState({
            message,
            type: 2
          }, () => {
            this.setValue(result)
          })
        } else {
          this.setState({
            message: '查无此用户，请重新输入'
          })
        }
      })
    })
  }
  public addAnchor () {
    this.form.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      const userInfo = this.userInfo
      const payload = {
        ...value,
        headUrl: userInfo.headImage,
        nickName: userInfo.nickName,
        phone: userInfo.phone,
        memberId: userInfo.id
      }
      api.addAnchore(payload).then(() => {
        this.setState({
          type: 2
        })
        APP.success('添加主播成功')
        this.hide()
        this.refresh()
      })
    })
  }
  public updateAnchor () {
    console.log('updateAnchor')
    this.form.props.form.validateFields((err, value) => {
      console.log(err, value, 'value')
      if (err) {
        return
      }
      console.log(value, 'value')
      const detail = this.anchorInfo
      if (detail) {
        api.updateAnchor({
          anchorId: detail.anchorId,
          anchorIdentityType: value.anchorIdentityType,
          anchorLevel: value.anchorLevel
        }).then(() => {
          APP.success('修改成功')
          this.hide()
          this.refresh()
        })
      }
    })
  }
  public changeAnchorStatus () {
    const detail = this.props.detail
    if (detail) {
      api.updateAnchorStatus({
        anchorId: detail.anchorId,
        status: detail.status === 0 ? 1 : 0
      }).then(() => {
        this.hide()
        this.refresh()
      })
    }
  }
  public setValue (value: any) {
    this.form.setValues(value)
  }
  public refresh () {
    if (this.props.refresh) {
      this.props.refresh()
    }
  }
  public render () {
    const detail = this.props.detail
    const { message } = this.state
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          getInstance={(ref) => {
            this.form = ref
          }}
          labelCol={{span: 8}}
          wrapperCol={{span: 12}}
        >
          <If condition={this.state.type === 1}>
            <FormItem
              label='用户手机号'
              name='phone'
              type='input'
            />
            <FormItem
              label='登录ID'
              name='memberId'
              type='input'
            />
            <div hidden={!this.state.message} style={{position: 'relative', top: -10}}>
              <div className='text-center mb10'>
                <span style={{color: 'red'}}>{this.state.message}</span>
              </div>
            </div>
            <div className='text-center'>
              <Button
                type='primary'
                onClick={() => {
                  this.searchUser()
                }}
              >
                查询用户
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                // type='primary'
                onClick={() => {
                  this.hide()
                }}
              >
                取消
              </Button>
            </div>
          </If>
          <If condition={this.state.type === 2}>
            <Row>
              <Col span={12}>
                <FormItem
                  label='手机号'
                  name='phone'
                  type='text'
                />
              </Col>
              <Col span={12}>
                <FormItem
                  label='用户昵称'
                  name='nickName'
                  type='text'
                />
              </Col>
            </Row>
            {message && (
              <div className='text-center' style={{position: 'relative', top: -15}}>
                <span style={{color: 'red'}}>{message}</span>
              </div>
            )}
            <FormItem
              name='anchorIdentityType'
            />
            <FormItem
              name='anchorLevel'
              verifiable
            />
            <div className='text-center'>
              <Button
                type='primary'
                onClick={() => {
                  if (this.anchorInfo) {
                    this.updateAnchor()
                  } else {
                    this.addAnchor()
                  }
                }}
              >
                确定
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                // type='primary'
                onClick={() => {
                  this.hide()
                }}
              >
                取消
              </Button>
            </div>
          </If>
          <If condition={this.state.type === 3}>
            <Row>
              <Col span={12}>
                <FormItem
                  label='手机号'
                  name='phone'
                  type='text'
                  style={{
                    margin: 0
                  }}
                />
              </Col>
              <Col span={12}>
                <FormItem
                  label='用户昵称'
                  name='nickName'
                  type='text'
                  style={{
                    margin: 0
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem
                  label='主播等级'
                  name='anchorLevel'
                  readonly
                  style={{
                    margin: 0
                  }}
                />
              </Col>
            </Row>
            <div className='text-center mb50'>
              <span style={{color: 'red'}}>
                {/* 该用户是黑名单用户！ */}
                {detail && detail.status === 0 ? '该用户将被添加到黑名单' : '该用户将被取消拉黑'}
              </span>
            </div>
            <div className='text-center'>
              <Button
                type='primary'
                onClick={() => {
                  this.changeAnchorStatus()
                }}
              >
                确定
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                // type='primary'
                onClick={() => {
                  this.hide()
                }}
              >
                取消
              </Button>
            </div>
          </If>
          <If condition={this.state.type === 4}>
            <Row>
              <Col span={12}>
                <FormItem
                  label='手机号'
                  name='phone'
                  type='text'
                />
              </Col>
              <Col span={12}>
                <FormItem
                  label='用户昵称'
                  name='nickName'
                  type='text'
                />
              </Col>
            </Row>
            <div className='text-center mb50'>
              <span style={{color: 'red'}}>{this.state.message}</span>
            </div>
            <div className='text-center'>
              <Button
                // type='primary'
                onClick={() => {
                  this.hide()
                }}
              >
                关闭
              </Button>
            </div>
          </If>
          <If condition={this.state.type === 5}>
            <div className='text-center mb20'>已存在以下用户主播身份为公司</div>
            <Row>
              <Col span={12}>
                <FormItem
                  label='手机号'
                  name='phone'
                  type='text'
                />
              </Col>
              <Col span={12}>
                <FormItem
                  label='用户昵称'
                  name='nickName'
                  type='text'
                />
              </Col>
            </Row>
            <div className='text-center mb50'>
              <span style={{color: 'red'}}>请清除其公司身份后重新添加！</span>
            </div>
            <div className='text-center'>
              <Button
                // type='primary'
                onClick={() => {
                  this.hide()
                }}
              >
                关闭
              </Button>
            </div>
          </If>
        </Form>
      </div>
    )
  }
}
export default Main
