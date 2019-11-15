import React from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig, memberOptions } from '../config'
import ReceiverWidget from './components/widget/receiver'
import ReceiverReadOnlyWidget from './components/widget/receiver/ReadOnly'
import MultiDateWidget from './components/widget/multi-date'
import TaskList from './TaskList'
import * as api from '../api'
import styles from './style.module.styl'

interface Props extends RouteComponentProps<{id: string}> {}
interface State {
  readonly: boolean
  receiveType: 1 | 2
  detail: Message.ItemProps
}
class Main extends React.Component<Props, State> {
  public form: FormInstance
  public id = this.props.match.params.id
  public state: State = {
    readonly: this.id === '-1' ? false : true,
    receiveType: 1,
    detail: {} as Message.ItemProps
  }
  public constructor (props: Props) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    if (this.id === '-1') {
      this.setValue({
        receiveType: 1
      })
    } else {
      api.fetchDetail(this.id).then((res) => {
        this.setState({
          detail: res
        })
        this.setValue({
          messageTitle: res.messageTitle,
          messageContent: res.messageContent,
          // messageType: res.messageType,
          messageType: '10',
          jumpUrl: res.jumpUrl,
          groupJobList: res.groupJobList
        })
      })
    }
  }
  public setValue(values: any) {
    this.form.setValues(values)
  }
  public save () {
    const values = this.form.getValues()
    const custom = values.custom
    values.memberIds = custom.text
    values.fileUrl = custom.path
    values.fileName = custom.filename
    values.ossFileName = custom.path ? custom.path.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/crm/', '')  : ''
    values.messageForm = 0
    delete values.custom
    values.groupType = values.groupType || []
    const groupType =  values.groupType
    if (groupType.includes('all')) {
      values.groupType = values.groupType.filter((item: string) => item !== 'all')
    }
    /** 固定用户 */
    if (values.receiveType === 1) {
      values.fileUrl = ''
      values.fileName = ''
      values.ossFileName = ''
      values.memberIdS = []
    } else {
      values.groupType = []
    }
    this.form.props.form.validateFields((err) => {
      if (err) {
        return
      }
      api.saveMessage(values).then((res) => {
        APP.success('添加消息成功')
        APP.history.push('/message/list')
      })
    })
  }
  public render () {
    const { readonly} = this.state
    return (
      <div
        style={{
          background: '#FFF'
        }}
      >
        <Form
          onChange={(field, value) => {
            if (field === 'receiveType') {
              this.setState({
                receiveType: value
              })
            }
          }}
          getInstance={(ref) => {
            this.form = ref
          }}
          className={styles.form}
          style={{
            padding: '40px 20px',
            // width: 500
          }}
          config={getFieldsConfig()}
          labelCol={{
            span: 6
          }}
          wrapperCol={{
            span: 18
          }}
          readonly={this.state.readonly}
          // disabled
        >
          <FormItem
            wrapperCol={{
              span: 4
            }}
            name='messageType'
            verifiable
          />
          <FormItem
            label='标题'
            name='messageTitle'
            verifiable
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='messageContent'
            verifiable
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='jumpUrl'
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            label='消息接收方'
            required
          >
            {!this.state.readonly ? (
              <div>
                <FormItem
                  name='receiveType'
                  type='radio'
                  labelCol={{
                    span: 0
                  }}
                  options={[{
                    label: '固定用户',
                    value: 1
                  }]}
                />
                <FormItem
                  hidden={this.state.receiveType !== 1}
                  name='groupType'
                  type='checkbox'
                  labelCol={{
                    span: 0
                  }}
                  verifiable
                  fieldDecoratorOptions={{
                    rules: [
                        {
                          validator: (rule, value = [], callback) => {
                            if (this.state.receiveType === 1) {
                              if (value.length === 0) {
                                callback('请选择固定用户')
                                return
                              }
                            }
                            callback()
                          }
                        }
                      ]
                  }}
                  controlProps={{
                    onChange: (value: string[]) => {
                      const values = this.form.getValues()
                      const allSelected = (values.groupType || []).indexOf('all') > -1
                      const newAllSelected = value.indexOf('all') > -1
                      if (!allSelected && newAllSelected || !allSelected && value.length === 5) {
                        setTimeout(() => {
                          this.form.props.form.setFieldsValue({
                            groupType: ['all', 10, 20, 30, 40, 0]
                          })
                        }, 0)
                      } else if (allSelected && !newAllSelected) {
                        setTimeout(() => {
                          this.form.setValues({
                            groupType: []
                          }) 
                        }, 0)
                      } else if (allSelected && value.length <= 5) {
                        setTimeout(() => {
                          this.form.setValues({
                            groupType: value.filter((item) => item !== 'all')
                          }) 
                        }, 0)
                      }
                    }
                  }}
                  options={memberOptions}
                />
                <FormItem
                  name='receiveType'
                  type='radio'
                  labelCol={{
                    span: 0
                  }}
                  options={[{
                    label: '自定义',
                    value: 2
                  }]}
                />
                <FormItem
                  verifiable
                  hidden={this.state.receiveType !== 2}
                  labelCol={{
                    span: 0
                  }}
                  inner={(form) => {
                    return form.getFieldDecorator('custom', {
                      rules: [
                        {
                          validator: (rule, value, callback) => {
                            if (this.state.receiveType === 2) {
                              if (!value.path && value.text.length === 0) {
                                callback('请选择输入会员ID，或上传号码')
                                return
                              }
                            }
                            callback()
                          }
                        }
                      ]
                    })(
                      <ReceiverWidget
                      />
                    )
                  }}
                >
                </FormItem>
              </div>
            ) : (
              <ReceiverReadOnlyWidget detail={this.state.detail} />
            )}
          </FormItem>
          {!this.state.readonly ? (
            <FormItem
              label='定时发送'
              required
              inner={(form) => {
                return form.getFieldDecorator('regularTime', {
                  rules: [
                    {
                      validator: (rule, value = [], callback) => {
                        if (value.length === 0) {
                          callback('请选择定时发送日期')
                          return
                        }
                        callback()
                      }
                    }
                  ]
                })(
                  <MultiDateWidget
                    showTime
                  />
                )
              }}
            />
          ) : (
            <FormItem
              label='任务列表'
              inner={(form) => {
                return form.getFieldDecorator('groupJobList')(
                  <TaskList />
                )
              }}
            />
          )}
          <div className='line mb10' />
          <FormItem
            hidden={readonly}
          >
            <div>
              <Button
                onClick={this.save}
                type='primary'
              >
                提交
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default withRouter(Main)
