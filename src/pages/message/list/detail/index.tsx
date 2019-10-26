import React from 'react'
import { Button } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
class Main extends React.Component {
  public render () {
    return (
      <div
        style={{
          background: '#FFF'
        }}
      >
        <Form
          style={{
            padding: '40px 20px',
            width: 500
          }}
          config={getFieldsConfig()}
        >
          <FormItem
            name='type'
          />
          <FormItem
            label='标题'
            name='title'
          />
          <FormItem
            name='content'
          />
          <FormItem
            name='jumpUrl'
          />
          <FormItem
            label='定时发送'
            inner={(form) => {
              return (
                <div>
                  <input />
                </div>
              )
            }}
          />
          
        </Form>
      </div>
    )
  }
}
export default Main
