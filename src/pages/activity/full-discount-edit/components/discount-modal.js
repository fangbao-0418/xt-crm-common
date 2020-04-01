import React, { PureComponent } from 'react'
import { Modal, Form, Radio, InputNumber } from 'antd'
import { connect } from '@/util/utils';
import { namespace } from '../model';

@connect(state => ({
  discountModal: state[namespace].discountModal
}))
@Form.create()
class DiscountModal extends PureComponent {
  /* 取消模态框操作 */
  handleCancel = () => {
    const { dispatch, discountModal } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        ...discountModal,
        visible: false,
      }
    })
  }

  /* 模态框消失之后回调 */
  handleAfterClose = () => {
    const { dispatch, discountModal } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        ...discountModal,
        title: '优惠条件'
      }
    })
  }

  render() {
    const {
      form: {
        getFieldDecorator
      },
      discountModal
    } = this.props

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Modal
        title={discountModal.title}
        visible={discountModal.visible}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
      >
        <Form layout="vertical">
          <Form.Item label="优惠门槛">
            {getFieldDecorator('b', {
              rules: [
                {
                  required: true,
                  message: '请输入活动名称',
                },
              ],
            })(
              <Radio.Group style={{ paddingLeft: 16 }}>
                <Radio
                  style={radioStyle}
                  value={0}
                >
                  指定商品&nbsp;&nbsp;<InputNumber />&nbsp;元&nbsp;&nbsp;&nbsp;
                  大于0，小数点后最多2位有效数字
                </Radio>
                <Radio
                  style={{
                    ...radioStyle,
                    marginTop: 16
                  }}
                  value={1}
                >
                  指定活动&nbsp;&nbsp;<InputNumber />&nbsp;件&nbsp;&nbsp;&nbsp;
                  大于0的整数
                </Radio>
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
              <Radio.Group style={{ paddingLeft: 16 }}>
                <Radio
                  style={radioStyle}
                  value={0}
                >
                  减&nbsp;&nbsp;<InputNumber />&nbsp;元&nbsp;&nbsp;&nbsp;
                  大于0，小数点后最多2位有效数字
                </Radio>
                <Radio
                  style={{
                    ...radioStyle,
                    marginTop: 16
                  }}
                  value={1}
                >
                  打&nbsp;&nbsp;<InputNumber />&nbsp;折&nbsp;&nbsp;&nbsp;
                  10分制，大于0小于10，保留小数点后1位
                </Radio>
                <Radio
                  style={{
                    ...radioStyle,
                    marginTop: 16
                  }}
                  value={1}
                >
                  售价&nbsp;&nbsp;<InputNumber />&nbsp;元&nbsp;&nbsp;&nbsp;
                  大于0，小数点后最多2位有效数字
                </Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default DiscountModal