import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Modal, Radio, Button, InputNumber, Input, message } from 'antd';
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
  /**
   * 售后金额
   */
  get refundAmount() {
    const serverNum = this.props.form.getFieldValue('serverNum');
    let checkVO = this.data.checkVO || {};
    let result = new Decimal(checkVO.unitPrice).mul(serverNum).ceil().toNumber();
    return serverNum === checkVO.maxServerNum ? checkVO.maxRefundAmount : result;
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
    let refundAmount = this.props.form.getFieldValue('refundAmount');
    return refundAmount * 100 + this.freight + this.alreadyRefundAmount === this.payMoney;
  }
  // 显示售后数目和售后金额
  get showAfterSaleInfo(): boolean {
    const isAllow = this.props.form.getFieldValue('isAllow')
    return isAllow === 1;
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
      if (values.serverNum == 0) {
        message.error('售后数目必须大于0');
        return;
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
        this.setState({ visible: false });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let checkVO = this.data.checkVO || {};
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
            {this.showAfterSaleInfo &&
              <>
                <Form.Item label="售后数目">
                  {getFieldDecorator('serverNum', {
                    initialValue: checkVO.serverNum,
                    rules: [
                      {
                        required: true,
                        message: '请输入售后数目',
                      },
                    ],
                  })(<InputNumber
                      min={1}
                      max={checkVO.maxServerNum}
                      placeholder="请输入"
                      onChange={(value: any = 0) => {
                        let refundAmount = new Decimal(checkVO.unitPrice).mul(value).ceil().div(100).toNumber();
                        this.props.form.setFieldsValue({ refundAmount })
                      }}
                  />)}
                  <span className="ml10">最多可售后数目：{checkVO.maxServerNum}</span>
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
                      max={+formatPrice(this.refundAmount)}
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      placeholder="请输入"
                    />,
                  )}
                  <span className="ml10">（最多可退￥{formatPrice(this.refundAmount)}）</span>
                </Form.Item>

                {this.isReturnShipping && (
                  <Form.Item label="退运费">
                    {getFieldDecorator('isRefundFreight', { initialValue: checkVO.isRefundFreight })(
                      <ReturnShippingSelect checkVO={checkVO} />,
                    )}
                  </Form.Item>
                )}
              </>
            }
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
