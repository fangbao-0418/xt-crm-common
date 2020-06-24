import React from 'react'
import { Button } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import AuthCodeInput from '@/components/auth-code-input'
import * as api from '../api'

interface State {
  options: { label: string, value: any }[]
}
class Main extends React.Component<{}, State> {
  public state: State = {
    options: []
  }
  static defaultProps = {
    balance: 0
  }
  public form: FormInstance
  public onSubmit = () => {
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      api.apply(values)
    })
  }
  public render () {
    return (
      <div>
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
          formItemStyle={{
            marginBottom: 0
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <FormItem
            name='accountAmount'
            label='提现金额'
            extra={(
              <div>
                可提现余额99999.00元
              </div>
            )}
          />
          <FormItem
            name='captcha'
            label='验证码'
            inner={(form) => {
              return form.getFieldDecorator('captcha')(
                <AuthCodeInput
                  maxLength={6}
                  onClick={() => {
                    this.getCode()
                  }}
                />
              )
            }}
          />
          <FormItem labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} className='text-center' >
            <Button
              type='primary'
              onClick={this.onSubmit}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }

  public getCode () {
    api.platformSend().then(() => {
    })
  }
}
export default Main
