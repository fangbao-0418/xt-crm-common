import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import { TagItem } from '../interface'
import * as api from '../api'

interface Props {
  record?: TagItem
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public save () {
    const record = this.props.record
    return new Promise((resove, reject) => {
      this.form.props.form.validateFields((err, values) => {
        if (err) {
          return
        }
        api.saveTag({
          ...values,
          id: record && record.id
        }).then((res) => {
          resove(res)
        }, () => {
          reject()
        })
      })
    })
  }
  public componentDidMount () {
    const record = this.props.record
    if (record) {
      this.form.setValues({
        ...record
      })
    }
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
          namespace='tag'
        >
          <FormItem
            name='title'
            verifiable
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
