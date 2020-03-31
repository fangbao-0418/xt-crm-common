import React, { PureComponent } from 'react'
import { Modal, Form, Radio, Input } from 'antd'

@Form.create()
class DiscountModal extends PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Modal
        title="优惠条件"
        visible={true}
      >
        <Form {...formItemLayout}>
          <Form.Item label="优惠门槛">
            {getFieldDecorator('b', {
              rules: [
                {
                  required: true,
                  message: '请输入活动名称',
                },
              ],
            })(
              <Radio.Group>
                <Radio style={radioStyle} value={0}>指定商品<Input /></Radio>
                <Radio style={radioStyle} value={1}>指定活动</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="优惠方式">
            {getFieldDecorator('a', {
              rules: [
                {
                  required: true,
                  message: '请输入活动名称',
                },
              ],
            })(
              <Radio.Group>
                <Radio style={radioStyle} value={0}>指定商品</Radio>
                <Radio style={radioStyle} value={1}>指定活动</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default DiscountModal