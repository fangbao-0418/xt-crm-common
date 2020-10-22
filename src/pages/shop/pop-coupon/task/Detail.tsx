import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Page from '@/components/page'
import AlertStyle from './components/alert-style'
import { parseQuery } from '@/util/utils'
import TargetUser from './components/target-user'
import SendTime from './components/send-time'
import CouponSelector from './components/coupon-selector'
import { Button } from 'antd'
import * as api from './api'
import { withRouter, RouteComponentProps } from 'react-router'

interface Props extends RouteComponentProps<{id: string}> {}

interface State {
  readonly: boolean
}

class Main extends React.Component<Props, State> {
  public form: FormInstance
  public id = this.props.match.params.id
  public query = parseQuery() as {code: string, readonly: string}
  public state: State = {
    readonly: true
  }
  public save = () => {
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        APP.error('请检查输入项')
        return
      }
      if (values.receiveUserGroup?.key === 1) {
        values.receiveUserGroup.value = values.receiveUserGroup.value.join(',')
      }
      const payload = {
        ...values,
        couponIds: (values.couponIds || []).map((item: any) => item.id).join(','),
        receiveUserGroup: values.receiveUserGroup?.key,
        userGroupValue: values.receiveUserGroup?.value,
        operateBehavior: 1,
        executionTime: values.executionTime?.value || 0,
        businessPlatform: 1
      }
      let p: Promise<any>
      if (this.id === '-1') {
        p = api.addTask(payload).then(() => {
          APP.success('新建成功')
        })
      } else {
        p = api.updateTask({
          ...payload,
          id: this.id
        }).then(() => {
          APP.success('修改成功')
        })
      }
      p.then(() => {
        APP.history.push('/shop/coupon-task')
      })
    })
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    if (this.id === '-1') {
      this.setState({
        readonly: false
      })
      const code = this.query.code
      if (code) {
        this.fetchCouponList({
          codes: [code]
        })
      }
      return
    }
    api.fetchTaskDetail(this.id).then((res) => {
      if (res.status === 0 && !this.query.readonly) {
        this.setState({
          readonly: false
        })
      }
      const couponIds = (res.couponIds || '').split(',')
      const sendStartTime = res.sendStartTime
      if (res.receiveUserGroup === 1) {
        res.userGroupValue = res.userGroupValue?.split?.(',').map((val: string) => Number(val)) || []
      }
      this.form.setValues({
        ...res,
        couponIds: [],
        receiveUserGroup: {
          key: res.receiveUserGroup,
          value: res.userGroupValue
        },
        executionTime: {
          key: sendStartTime === 0 ? 0 : 1,
          value: sendStartTime
        }
      })
      this.fetchCouponList({
        codes: res.codes
      })
    })
  }
  public fetchCouponList (payload: {
    codes: any[]
    page?: number
    pageSize?: number
  }) {
    api.fetchCouponList({
      ...payload,
      pageSize: payload.codes.length
    }).then((res) => {
      this.form.setValues({
        couponIds: res.records
      })
    })
  }
  public render () {
    const { readonly } = this.state
    return (
      <Page>
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
          readonly={readonly}
        >
          <FormItem
            label='任务名称'
            name='name'
            verifiable
            wrapperCol={{ span: 6 }}
            fieldDecoratorOptions={{
              rules: [
                { required: true, message: '任务名称不能为空' },
                { max: 64, message: '任务名称最长64个字符' }
              ]
            }}
          />
          <FormItem
            label='目标用户'
            inner={(form) => {
              return form.getFieldDecorator('receiveUserGroup', {
                rules: [
                  { required: true, message: '请选择目标用户' },
                  {
                    validator: (rule, value, cb) => {
                      if (!value) {
                        cb('请选择目标用户')
                      } else if (value?.key === 1 && (!value?.value||value?.value?.length===0)) {
                        cb('请选择用户等级')
                      } else if (value?.key === 2) {
                        if (!value?.value) {
                          cb('请输入用户手机号')
                        }
                        if (!(/^(1\d{10},?)+$/).test(value.value)) {
                          cb('格式不正确，请输入正确用户手机号')
                        }
                      } else if (value?.key === 3 && !value?.value) {
                        cb('请上传文件')
                      }
                      cb()
                    }
                  }
                ]
              })(
                <TargetUser readonly={readonly} />
              )
            }}
          />
          <FormItem
            label='优惠券弹框样式'
            inner={(form) => {
              return form.getFieldDecorator('displayStyle', {
                initialValue: 1,
                rules: [
                  { required: true, message: '请选择优惠券弹框样式' }
                ]
              })(
                <AlertStyle readonly={readonly} />
              )
            }}
          />
          <FormItem
            label='发送时间'
            inner={(form) => {
              return form.getFieldDecorator('executionTime', {
                rules: [
                  { required: true, message: '请选择发送时间' }
                ]
              })(
                <SendTime readonly={readonly} />
              )
            }}
          />
          <FormItem
            label='请选择优惠券'
            inner={(form) => {
              return form.getFieldDecorator('couponIds', {
                rules: [
                  { required: true, message: '请选择优惠券' }
                ]
              })(
                <CouponSelector readonly={readonly} />
              )
            }}
          />
          <FormItem>
            {readonly ? (
              <Button
                type='primary'
                onClick={() => {
                  APP.history.push('/shop/coupon-task')
                }}
              >
                返回
              </Button>
            ) : (
              <>
                <Button
                  type='primary'
                  className='mr8'
                  onClick={this.save}
                >
                  保存
                </Button>
                <Button
                  onClick={() => {
                    APP.history.push('/shop/coupon-task')
                  }}
                >
                  取消
                </Button>
              </>
            )}
          </FormItem>
        </Form>
      </Page>
    )
  }
}
export default withRouter(Main)
