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
    this.form.props.form.validateFields((err, { storeId, productIds, memberPhones }) => {
      if (err) {
        return
      }

      memberPhones = (memberPhones || '').split(',').map((item: string) => item.trim()).join(',')

      if (!productIds && !memberPhones) {
        APP.error('商品ID和下单手机号至少填入一项')
        return
      }

      const ids = /^\s*\d+\s*(,\s*\d+\s*)*$/
      const phoneReg = /^\s*[1]([0-9])[0-9]{9}\s*(,\s*[1]([0-9])[0-9]{9}\s*)*$/
      if (productIds && !ids.test(productIds)) {
        APP.error('商品ID格式有误')
        return
      }
      if (memberPhones && !phoneReg.test(memberPhones)) {
        const memberPhonesArr = memberPhones.split(',')
        const index = memberPhonesArr.findIndex((item: string) => !phoneReg.test(item))
        APP.error(`第 ${index + 1} 个手机号码格式有误`)
        return
      }

      const params = {
        storeId,
        productIds: (productIds || '').split(',').map((item: string) => item.trim()).join(','),
        memberPhones
      }
      console.log(params)
      api.submit(params).then(() => {
        APP.success('处理成功')
        this.form.reset()
      })
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
          />
          <FormItem
            wrapperCol={{
              span: 8
            }}
            name='memberPhones'
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