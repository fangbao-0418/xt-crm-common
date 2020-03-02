import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'

import * as api from '../api'

class Main extends React.Component {
  public form: FormInstance
  public save () {
    this.form.props.form.validateFields((err, values) => {
      api.saveTag(values).then(() => {

      })
    })
  }
  public render () {
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          labelCol={{span: 7}}
          wrapperCol={{span: 16}}
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          <FormItem
            name='title'
            controlProps={{
              style: {width: 200}
            }}
          />
          <FormItem
            name='sort'
            controlProps={{
              style: {width: 200}
            }}
          />
        </Form>
      </div>
    )
  }
}
export default Main
