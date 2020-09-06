import React from 'react'
import { Form, FormItem } from '@/packages/common/components'
import { getDefaultConfig } from './config'

class Main extends React.Component {
  public render () {
    return (
      <Form config={getDefaultConfig()}>
        <FormItem></FormItem>
      </Form>
    )
  }
}