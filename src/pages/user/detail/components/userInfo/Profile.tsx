import React from 'react'
import { connect, parseQuery, setQuery } from '@/util/utils'
import { FormComponentProps } from 'antd/lib/form'
import { Form, Modal, InputNumber } from 'antd'
import { updateDepositAmount, updateCreditAmount, enablePermission, enableShopPermission } from './api'
const FormItem = Form.Item

interface Props extends FormComponentProps {}
interface State {
  label?: string
  title: string
  visible: boolean
  name: string
}

export function withModal (WrappedComponent: React.ComponentClass<any>) {
  class Main extends React.Component<Props, State> {
    wrappedCompRef: any
    query: any = parseQuery()
    state: State = {
      title: '',
      visible: false,
      name: 'depositAmount'
    }
    constructor (props: Props) {
      super(props)
      this.wrappedCompRef = React.createRef()
    }
  
    modal = {
      showModal: (payload: any) => {
        switch (payload.type) {
          // 保证金
          case 'bail':
            this.setState({
              label: '保证金',
              visible: true,
              name: 'depositAmount'
            })
            break
          // 采购额度
          case 'purchaseQuota':
            this.setState({
              label: '采购额度',
              visible: true,
              name: 'creditAmount'
            })
            break
          default:
            break
        }
        this.forceUpdate(() => {
          this.props.form.setFieldsValue({
            depositAmount: payload.depositAmount,
            creditAmount: payload.creditAmount
          })
        })
      }
    }
    onCancel = () => {
      this.setState({ visible: false })
    }
    onOk = () => {
      const { name } = this.state
      const { memberId } = this.query
      this.props.form.validateFields(async (err, vals) => {
        if (!err) {
          // 保证金
          if (name === 'depositAmount') {
            const res = await updateDepositAmount({
              memberId,
              depositAmount: vals.depositAmount
            })
            if (res) {
              APP.success('修改保证金成功')
              this.wrappedCompRef.current.handleSearch()
              this.onCancel()
            }
          }
          // 采购额度
          else if (name === 'creditAmount') {
            const res = await updateCreditAmount({
              memberId,
              creditAmount: vals.creditAmount
            })
            if (res) {
              APP.success('修改采购额度成功')
              this.wrappedCompRef.current.handleSearch()
              this.onCancel()
            }
          }
        }
      })
    }
    render() {
      const { label, visible, name } = this.state
      const { form, ...otherProps } = this.props
      return (
        <>
          <Modal
            title={`修改${label}`}
            visible={visible}
            onCancel={this.onCancel}
            onOk={this.onOk}
            okText='提交'
            cancelText='取消编辑'
          >
            <Form
              layout='inline'
            >
              <FormItem
                label={label}
              >
                {form.getFieldDecorator(name, {
                  rules: [{
                    required: true,
                    message: `请输入${label}`
                  }]
                })(
                  <InputNumber
                    min={0}
                    style={{ width: 172 }}
                    placeholder='请输入'
                  />
                )}
              </FormItem>
            </Form>
          </Modal>
          <WrappedComponent
            style={{marginTop: 20}}
            // bizSource='20'
            // title='喜团好店'
            wrappedCompRef={this.wrappedCompRef}
            {...otherProps}
            modal={this.modal}
          />
        </>
      )
    }
  }
  return Form.create({ name: 'userinfo-modal' })(Main)
}