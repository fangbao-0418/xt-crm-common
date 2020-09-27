import React from 'react'
import { Modal } from 'antd'
import { getColumn, addColumn, updateColumn } from './api'
import { Form, FormItem } from '@/packages/common/components'
import { defaultFormConfig, formLayoutConfig } from './config'
import { FormInstance } from '@/packages/common/components/form'

interface State {
  visible: boolean
  id?: number
  readonly?: boolean
}

class Main extends React.Component<{}, State> {
  public formRef: FormInstance
  public state: State = {
    visible: false,
    readonly: false
  }
  public async fetchData () {
    const res = await getColumn(this.state.id!)
    this.formRef.setValues(res)
  }
  public onOK = () => {
    this.formRef.props.form.validateFields(async (errs, vals) => {
      if (!errs) {
        let res
        if (this.state.id) {
          res = await updateColumn({ ...vals, id: this.state.id })
        } else {
          res = await addColumn(vals)
        }
        if (res) {
          APP.success('操作成功')
          APP.history.goBack()
        }
      }
    })
  }
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public open = (id?: number, readonly?: boolean) => {
    this.setState({
      visible: true,
      readonly,
      id
    }, () => {
      this.state.id !== undefined && this.fetchData()
    })
  }
  public render () {
    const { visible, readonly, id } = this.state
    return (
      <Modal
        title={!!readonly ? '查看栏目' : id === undefined ? '新增栏目' : '编辑栏目'}
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
          <FormItem name='name' verifiable />
          <FormItem name='desc' />
          <FormItem name='sort' />
        </Form>
      </Modal>
    )
  }
}
 
export default Main