import React from 'react'
import { Button } from 'antd'
import { Form, FormItem } from '@/packages/common/components'
import { FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from './config'

const layoutConfig = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}
interface Props {
  onMounted: (form: FormInstance) => void
}
class Main extends React.Component<Props, {}> {
  public form: FormInstance
  public componentDidMount () {
    this.props.onMounted(this.form)
  }
  public render () {
    return (
      <Form getInstance={(ref) => this.form = ref} {...layoutConfig} config={getFieldsConfig()}>
        <FormItem name='name' verifiable />
        <FormItem name='content' />
        <FormItem name='sort' verifiable />
      </Form>
    )
  }
}

export default Main