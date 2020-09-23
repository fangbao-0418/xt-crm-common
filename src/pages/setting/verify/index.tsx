import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { Button } from 'antd'
import { getFieldsConfig } from './config'
import * as api from './api'

interface Props {}

interface State {
  phonesValidate: boolean
}

class Main extends React.Component<Props, State> {
  public form: FormInstance
  public state:State = {
    phonesValidate: false
  }
  public handleSubmit = () => {
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      const { phonesValidate } = this.state
      if (!phonesValidate) {
        APP.error('请先校验手机号')
        return
      }

      console.log(values)
    })
  }
  public handleSupplierVerify = () => {
    this.form.props.form.validateFields(['supplierId'], (err, values) => {
      if (err) {
        return
      }

      api.supplierVerify(values).then(res => {
        this.form.setValues(res)
      })
    })
  }
  public handlePhonesVerify = () => {
    this.form.props.form.validateFields(['phones'], (err, values) => {
      if (err) {
        return
      }

      api.supplierVerify(values).then(res => {
        if (res) {
          this.setState({
            phonesValidate: true
          })
        }
      })
    })
  }
  public formChange = (field: any, values: any) => {
    if (field === 'phones') {
      this.setState({
        phonesValidate: false
      })
    }
  }
  public render () {
    const { phonesValidate } = this.state
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
          onChange={this.formChange}
        >
          <FormItem
            wrapperCol={{
              span: 8
            }}
            name='supplierId'
            addonAfter={(
              <Button className='ml8' onClick={this.handleSupplierVerify}>
                校验供应商
              </Button>
            )}
            required
            verifiable
          />
          <FormItem
            wrapperCol={{
              span: 8
            }}
            name='goodsId'
            required
            verifiable
          />
          <FormItem
            wrapperCol={{
              span: 8
            }}
            name='phones'
            addonAfter={(
              <Button className='ml8' onClick={this.handlePhonesVerify}>
                校验手机号
              </Button>
            )}
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
            {
              phonesValidate
                ? '(已校验手机号)'
                : '(提交前请先校验手机号)'
            }
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Main