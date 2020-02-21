import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'

class Main extends React.Component {
  public form: FormInstance
  public render () {
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          <FormItem name='tagName' />
          <FormItem name='tagSort' />
        </Form>
      </div>
    )
  }
}
export default Main
