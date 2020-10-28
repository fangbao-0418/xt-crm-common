import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { getFieldsConfig } from './config'

class Main extends React.Component {
  public render () {
    return (
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} config={getFieldsConfig()}>
        <FormItem name='name' required />
        <FormItem name='content' />
        <FormItem name='sort' />
      </Form>
    )
  }
}

export default Main