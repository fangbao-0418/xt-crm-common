import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Modal, Radio, Button, InputNumber, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, radioStyle } from '@/config';
import { namespace } from '../../refund/model';
import { enumRefundType } from '../../constant';
import ReturnShippingSelect from '../ReturnShippingSelect';
import { formatPrice } from '@/util/format';
import { formatMoney } from '@/pages/helper';
import { Decimal } from 'decimal.js';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data;
}
interface State {
  visible: boolean;
}
class CheckRefund extends React.Component<Props, State> {
  state: State = {
    visible: false,
  };
  constructor(props: Props) {
    super(props);
    this.onOk = this.onOk.bind(this);
  }
  get refundAmount(): number {
    return this.props.form.getFieldValue('refundAmount');
  }
  get data() {
    return this.props.data || {};
  }
  /**
   * 获取运费
   */
  get freight() {
    let checkVO = this.data.checkVO || {};
    return checkVO.freight;
  }
  get payMoney() {
    let orderInfoVO = this.data.orderInfoVO || {};
    return orderInfoVO.payMoney;
  }
  get alreadyRefundAmount() {
    let orderServerVO = this.data.orderServerVO || {};
    return orderServerVO.alreadyRefundAmount;
  }
  get isTrigger() {
    return this.refundAmount * 100 + this.freight + this.alreadyRefundAmount === this.payMoney;
  }
  /**
   * 是否退运费
   */
  get isReturnShipping() {
    return this.freight > 0 && this.isTrigger;
  }
  onOk() {
    this.props.form.validateFields((errors, values) => {
      if (values.refundAmount) {
        values.refundAmount = new Decimal(values.refundAmount).mul(100).toNumber();
      }
      if (!errors) {
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload: {
            id: this.props.match.params.id,
            status: 1,
            refundType: enumRefundType.Refund,
            ...values,
          },
        });
        this.setState({visible: false});
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let checkVO = this.data.checkVO || {};
    let orderServerVO = this.data.orderServerVO || {};
    return (
      <>
        <Modal
          title="处理结果"
          visible={this.state.visible}
          onOk={this.onOk}
          cancelText="返回"
          okText="提交"
          onCancel={() => this.setState({ visible: false })}
        >
          <Form {...formItemLayout}>
            <Form.Item label="处理方式">
              {getFieldDecorator('isAllow', {
                rules: [
                  {
                    required: true,
                    message: '请选择处理方式',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio style={radioStyle} value={1}>
                    同意售后
                  </Radio>
                  <Radio style={radioStyle} value={0}>
                    拒绝售后
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="售后数目">
              {getFieldDecorator('serverNum', {
                rules: [
                  {
                    required: true,
                    message: '请输入售后数目',
                  },
                ],
              })(<InputNumber min={1} placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="退款金额">
              {getFieldDecorator('refundAmount', {
                initialValue: formatPrice(checkVO.refundAmount),
                rules: [
                  {
                    required: true,
                    message: '请输入退款金额',
                  },
                ],
              })(
                <InputNumber
                  min={0.01}
                  max={formatMoney(
                    orderServerVO.productVO &&
                      orderServerVO.productVO[0] &&
                      orderServerVO.productVO[0].ableRefundAmount,
                  )}
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="请输入"
                />,
              )}
            </Form.Item>
            {this.isReturnShipping && (
              <Form.Item label="退运费">
                {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(
                  <ReturnShippingSelect checkVO={checkVO} />,
                )}
              </Form.Item>
            )}
            <Form.Item label="说    明">
              {getFieldDecorator('info')(
                <Input.TextArea placeholder="请输入说明" autosize={{ minRows: 3, maxRows: 5 }} />,
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Button type="primary" onClick={() => this.setState({ visible: true })}>
          处理结果
        </Button>
      </>
    );
  }
}
export default withRouter(Form.create<Props>()(CheckRefund));
