import React from 'react'
import { Button } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import AuthCodeInput from '@/components/auth-code-input'

interface State {
  options: { label: string, value: any }[]
}
class Main extends React.Component<{}, State> {
  public state: State = {
    options: []
  }
  public form: FormInstance
  public onSubmit = () => {
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
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
        >
          <FormItem
            name='a'
            label='提现金额'
            extra={(
              <div>
                可提现余额99999.00元
              </div>
            )}
          />
          <FormItem
            name='c'
            label='验证码'
            inner={(form) => {
              return form.getFieldDecorator('c')(
                <AuthCodeInput
                  maxLength={6}
                  onClick={() => {
                    console.log('click')
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
}
export default Main
