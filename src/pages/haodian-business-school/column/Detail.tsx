import React from 'react'
import { Modal, Switch } from 'antd'
import { addColumn, updateColumn } from './api'
import { Form, FormItem } from '@/packages/common/components'
import { defaultFormConfig, formLayoutConfig } from './config'
import { FormInstance } from '@/packages/common/components/form'

interface Props {
  refresh: () => void
  dataSource: any
}
interface State {
  visible: boolean
  readonly?: boolean
}

class Main extends React.Component<Props, State> {
  public formRef: FormInstance
  public state: State = {
    visible: false,
    readonly: false
  }
  public componentWillReceiveProps (nextProps: Props) {
    if (nextProps.dataSource && this.props.dataSource !== nextProps.dataSource) {
      this.formRef?.setValues(nextProps.dataSource)
    }
  }
  public onOK = () => {
    this.formRef.props.form.validateFields(async (errs, vals) => {
      if (!errs) {
        let res
        if (this.props.dataSource) {
          res = await updateColumn({ ...vals, id: this.props.dataSource.id })
        } else {
          res = await addColumn(vals)
        }
        if (res) {
          APP.success('操作成功')
          this.setState({ visible: false }, this.props.refresh)
        }
      }
    })
  }
  public onCancel = () => {
    this.setState({ visible: false }, () => {
      this.formRef.resetValues()
    })
  }
  public open = (readonly?: boolean) => {
    this.setState({
      visible: true,
      readonly
    })
  }
  public render () {
    const { visible, readonly } = this.state
    return (
      <Modal
        width={600}
        title={!!readonly ? '查看栏目' : this.props.dataSource === undefined ? '新增栏目' : '编辑栏目'}
        visible={visible}
        onOk={this.onOK}
        onCancel={this.onCancel}
      >
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
              return form.getFieldDecorator('showStatus')(<Switch disabled={readonly} />)
            }}
          />
        </Form>
      </Modal>
    )
  }
}
 
export default Main