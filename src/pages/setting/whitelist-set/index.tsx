import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import { Button } from 'antd'
import { getFieldsConfig } from './config'
import * as api from './api'

interface Props extends AlertComponentProps {}

class Main extends React.Component<Props> {
  public form: FormInstance
  public handleSubmit = () => {
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      api.submit(values).then(() => {
        APP.success('处理成功')
        this.form.reset()
      })
      console.log(values)
    })
  }
  public check = () => {
    this.form.props.form.validateFields(['storeId'], (err, values) => {
      if (err) {
        return
      }

      api.check(values).then(res => {
        this.props.alert({
          title: '查询',
          footer: null,
          content: (
            <div>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label='供应商ID'>
                {res.storeId || '-'}
              </FormItem>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label='商品ID'>
                {res.productIds || '-'}
              </FormItem>
              <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label='下单手机号'>
                {res.memberPhones || '-'}
              </FormItem>
            </div>
          )
        })
      })
    })
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFFFFF',
          padding: '40px 20px 20px'
        }}
      >
        <Form
          config={getFieldsConfig()}
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          <FormItem
            wrapperCol={{
              span: 8
            }}
            name='storeId'
            addonAfter={(
              <Button className='ml8' onClick={this.check}>
                查询
              </Button>
            )}
            required
            verifiable
          />
          <FormItem
            wrapperCol={{
              span: 8
            }}
            name='productIds'
            required
            verifiable
          />
          <FormItem
            wrapperCol={{
              span: 8
            }}
            name='memberPhones'
            required
            verifiable
          />
          <FormItem>
            <Button
              className='mr8'
              type='primary'
              onClick={this.handleSubmit}
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Alert(Main)