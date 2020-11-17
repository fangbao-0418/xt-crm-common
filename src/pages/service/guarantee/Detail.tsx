import React from 'react'
import { Button } from 'antd'
import { Form, FormItem } from '@/packages/common/components'
import { FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from './config'
import UploadView from '@/components/upload'

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
        <FormItem
          label='icon'
          required
          inner={(form) => {
            return form.getFieldDecorator('imageUrl', {
              rules: [{
                validator: (rule: any, value: any, callback: any) => {
                  if (!value || Array.isArray(value) && value.length === 0) {
                    callback('请上传icon图片')
                    return
                  }
                  callback()
                }
              }]
            })(
              <UploadView
                ossType='cos'
                placeholder='上传icon'
                listType='picture-card'
                listNum={1}
                size={0.3}
              />
            )
          }}
        />
      </Form>
    )
  }
}

export default Main