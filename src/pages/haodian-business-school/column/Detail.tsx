import React from 'react'
import { Switch } from 'antd'
import { Form, FormItem } from '@/packages/common/components'
import { defaultFormConfig, formLayoutConfig } from './config'
import { FormInstance } from '@/packages/common/components/form'

interface Props {
  readonly?: boolean
  mounted?: (ref: Main) => void
}

class Main extends React.Component<Props, {}> {
  public formRef: FormInstance
  public componentDidMount () {
    this.props.mounted?.(this)
  }
  public render () {
    const { readonly } = this.props
    return (
      <Form
        readonly={readonly}
        getInstance={ref => this.formRef = ref}
        config={defaultFormConfig}
        {...formLayoutConfig}
      >
        <FormItem
          name='columnName'
          verifiable
        />
        <FormItem
          name='description'
        />
        <FormItem
          name='sort'
        />
        <FormItem
          label='加入喜团情报站(资讯标题滚动显示)'
          inner={(form) => {
            return form.getFieldDecorator('showStatus', {
              valuePropName: 'checked'
            })(<Switch disabled={readonly} />)
          }}
        />
      </Form>
    )
  }
}
 
export default Main