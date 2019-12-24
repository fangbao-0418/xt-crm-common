import React from 'react'
import { Modal, InputNumber } from 'antd'
import { ModalProps } from 'antd/es/modal'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'

export interface OffStockModalInstanceProps {
  resetFields(): void
}
interface Props extends ModalProps {
  stockNum?: number
  /** 点击确定回调 */
  onOk?: (vals: any) => void;
}

class Main extends React.Component<Props, any> {
  public form: FormInstance
  public handleOk = () => {
    this.form.props.form.validateFields(async (err, vals) => {
      if (!err) {
        const { onOk } = this.props
        onOk && onOk(vals)
      }
    })
  }
  public resetFields () {
    this.form.props.form.resetFields()
  }
  public render () {
    const { visible, onOk, onCancel, stockNum } = this.props
    return (
      <Modal
        title='核销库存'
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        okText='确认核销'
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          getInstance={ref => this.form = ref}
        >
          <FormItem
            label='核销'
            required
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('eliminateCount', {
                    rules: [{
                      required: true,
                      message: '核销数目不能为空'
                    }]
                  })(
                    <InputNumber
                      min={0}
                      max={stockNum}
                      style={{ width: 172 }}
                    />
                  )}
                  <span className='ml10'>件（最多{stockNum}件）</span>
                </>
              )
            }}
          />
          <FormItem
            name='reason'
            type='textarea'
            label='核销原因'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                message: '核销原因',
                required: true
              }]
            }}
          />
        </Form>
      </Modal>
    )
  }
}

export default Main