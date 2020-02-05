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
  /** 1-新增 2-修改 3-拉黑操作 4-错误提示 5-已存在以下用户主播身份为公司 6-批量添加提示 */
  type: 1 | 2 | 3 | 4 | 5 | 6
  message: string
  /** 添加方式 1-单个 2-批量 */
  addType: 1 | 2
  /** 批量添加主播信息 */
  multiInfo: MultiInfo
  /** 批量新增手机号文本 */
  phoneList: string
}

/** 批量添加主播信息 */
interface MultiInfo {
  /** 待添加主播 */
  waitAdd: {phone: string, id: number}[],
  /** 已存在 */
  already: string[]
  /** 黑名单 */
  blackList: string[],
  /** 格式错误 */
  formatError: string[],
  /** 非会员 */
  outsider: string[]
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
    message: '',
    addType: 1,
    multiInfo: {
      waitAdd: [],
      already: [],
      blackList: [],
      formatError: [],
      outsider: []
    },
    phoneList: ''
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
  /** 批量新增主播手机号校验 */
  public validateListPhone (phoneList: string) {
    api.checkPhoneList(phoneList).then((res) => {
      const { validUsers, inValidPhone } = res
      const validPhone = validUsers.map((item) => item.phone)
      if (validUsers.length === 0) {
        this.getMultiInfo([], validUsers, inValidPhone )
        this.setState({
          type: 6
        })
        return
      }
      api.checkMultiAnchorPhone(validPhone).then((res2) => {
        this.getMultiInfo(res2, validUsers, inValidPhone )
        this.setState({
          type: 6
        })
      })
    })
  }
  public getMultiInfo (errorValue: {
    /** 错误编码(0-手机号错误, 1-已存在, 2-已拉黑, 3-非会员) */
    errorCode: 0 | 1 | 2 | 3
    phone: string
  }[], validUsers: {id: number, phone: string}[], inValidPhone: string[]) {
    const multiInfo: MultiInfo = {
      waitAdd: [],
      already: [],
      blackList: [],
      formatError: [],
      outsider: []
    }
    errorValue.map((item) => {
      if (item.errorCode === 1) {
        multiInfo.already.push(item.phone)
      } else if (item.errorCode === 2) {
        multiInfo.blackList.push(item.phone)
      } else if (item.errorCode === 0) {
        multiInfo.formatError.push(item.phone)
      } else if (item.errorCode === 3) {
        multiInfo.outsider.push(item.phone)
      }
      /** 过滤掉已存在、拉黑的主播数据 */
      validUsers = validUsers.filter((item2) => item.phone !== item2.phone)
    })
    multiInfo.waitAdd = validUsers
    /** 非会员 */
    inValidPhone.map((item) => {
      if (!APP.regular.phone.test(item)) {
        multiInfo.formatError.push(item)
      } else {
        multiInfo.outsider.push(item)
      }
    })
    this.setState({
      multiInfo
    })
  }
  public searchUser () {
    const { addType } = this.state
    this.form.props.form.validateFields((err, value) => {
      if (addType === 2) {
        this.validateListPhone(value.phoneList)
        return
      }
      if (err) {
        return
      }
      if (!value.phone && !value.memberId) {
        APP.error('请输入用户手机号或登录ID')
        return
      }
      api.fetchUserInfo({
        phone: value.phone,
        memberId: value.memberId
      }).then((res) => {
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
          /** 添加主播此处不需要进行实名认证 */
          // if (!info1 && info2.authStatus !== 1) {
          //   message = '该用户未进行实名认证，不允许添加为主播！'
          // }
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
      api.addAnchor(payload).then(() => {
        this.setState({
          type: 2
        })
        APP.success('添加主播成功')
        this.hide()
        this.refresh()
      })
    })
  }
  /** 批量添加 */
  public multiAddAnchor () {
    this.form.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      const { waitAdd } = this.state.multiInfo
      const payload = {
        ...value,
        users: waitAdd.map((item) => {
          return {
            ...item,
            memberid: item.id
          }
        })
      }
      api.multiAddAnchor(payload).then(() => {
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
  public exportMultiAddError () {
    const { multiInfo } = this.state
    /** 错误编码(0-手机号错误, 1-已存在, 2-已拉黑, 3-非会员) */
    const payload: {errorCode: 0 | 1 | 2 | 3, phone: string}[] = []
    multiInfo.outsider.map((item) => {
      payload.push({
        phone: item,
        errorCode: 3
      })
    })
    multiInfo.blackList.map((item) => {
      payload.push({
        phone: item,
        errorCode: 2
      })
    })
    multiInfo.formatError.map((item) => {
      payload.push({
        phone: item,
        errorCode: 0
      })
    })
    multiInfo.already.map((item) => {
      payload.push({
        phone: item,
        errorCode: 1
      })
    })
    api.exportMultiAddErrorInfo(payload)
  }
  public render () {
    const detail = this.props.detail
    const { message, multiInfo } = this.state
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
              label='添加方式'
              name='type'
              required={false}
              verifiable
              type='radio'
              controlProps={{
                onChange: (e: any) => {
                  this.setState({
                    addType: e.target.value
                  })
                }
              }}
              fieldDecoratorOptions={{
                initialValue: 1
              }}
              options={[
                {label: '单个添加', value: 1},
                {label: '批量添加', value: 2}
              ]}
            />
            <If condition={this.state.addType === 1}>
              <FormItem
                label='用户手机号'
                name='phone'
                required={false}
                verifiable
              />
              <FormItem
                label='登录ID'
                name='memberId'
                required={false}
                verifiable
              />
            </If>
            <If condition={this.state.addType === 2}>
              <FormItem
                label='请填入手机号'
                type='textarea'
                name='phoneList'
                placeholder='请输入用户手机号,多个手机号请用英文逗号隔开'
                controlProps={{
                  rows: 4,
                  maxLength: 12000,
                  onChange: (e: any) => {
                    let text = e.target.value
                    setTimeout(() => {
                      const maxSize = 1000
                      text = text.replace(/[^\d,]+/, '').replace(/(\d{11})\d+/, '$1')
                      if (text.split(',').length > maxSize) {
                        text = text.split(',').slice(0, maxSize).join(',')
                      }
                      this.form.setValues({phoneList: text})
                    }, 0)
                  }
                }}
              />
              <div
                style={{
                  margin: '0 60px 30px',
                  color: '#999',
                  fontSize: 12
                }}
              >
              提示：仅允许添加手机号，多个手机号请用英文逗号隔开；最多添加1000个手机号
              </div>
            </If>
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
              verifiable
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
          <If condition={this.state.type === 6}>
            <div className='text-center mb20'>
              共识别到{multiInfo.waitAdd.length}个用户可添加为主播
            </div>
            <If condition={multiInfo.waitAdd.length > 0}>
              <FormItem
                name='anchorIdentityType'
                verifiable
                options={[
                  {label: '供应商', value: 20},
                  {label: '合作网红', value: 30},
                  {label: '代理', value: 40}
                ]}
              />
              <FormItem
                name='anchorLevel'
                verifiable
              />
            </If>
            <div
              style={{
                margin: '0 80px 50px'
              }}
            >
              {multiInfo.blackList.length}个黑名单用户不可添加,
              {multiInfo.already.length}个用户已是主播,
              {multiInfo.outsider.length}个用户非喜团会员,
              {multiInfo.formatError.length}段文字格式不正确
              <span
                className='href'
                onClick={this.exportMultiAddError.bind(this)}
              >
                &nbsp;&nbsp;导出
              </span>
            </div>
            <div
              className='text-center mb20'
              style={{
                color: '#999',
                fontSize: 12
              }}
            >
              提示：如有无法识别字符请检查手机号长度或者逗号格式是否英文状态
            </div>
            <div className='text-center'>
              <If condition={multiInfo.waitAdd.length > 0}>
                <Button
                  type='primary'
                  onClick={() => {
                    this.multiAddAnchor()
                  }}
                >
                  确认添加
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
              </If>
              <If condition={multiInfo.waitAdd.length === 0}>
                <Button
                  onClick={() => {
                    this.hide()
                  }}
                >
                  关闭
                </Button>
              </If>
            </div>
          </If>
        </Form>
      </div>
    )
  }
}
export default Main
