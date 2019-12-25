import React from 'react'
import { Modal, InputNumber } from 'antd'
import { ModalProps } from 'antd/es/modal'
import { memoize } from 'lodash'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'

export interface OffStockModalInstanceProps {
  resetFields(): void
}
interface Props extends ModalProps {
  stockNum: number
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
  public getBtnText = memoize((stock: number) => {
    return stock >= 0 ? '核销库存' : '核销负库存'
  })
  public render () {
    const { visible, onCancel, stockNum } = this.props
    return (
      <Modal
        title={this.getBtnText(stockNum)}
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
                      message: '请输入核销数目'
                    }]
                  })(
                    <InputNumber
                      min={0}
                      max={Math.abs(stockNum)}
                      style={{ width: 100 }}
                    />
                  )}
                  <span className='ml10'>件（最多{Math.abs(stockNum)}件）</span>
                </>
              )
            }}
          />
          <FormItem
            name='info'
            type='textarea'
            label='核销原因'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                message: '请输入核销原因',
                required: true
              }, {
                max: 200,
                message: '核销原因最长不超过200字符'
              }]
            }}
          />
        </Form>
      </Modal>
    )
  }
}

export default Main