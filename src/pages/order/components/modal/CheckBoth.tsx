import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Modal, Radio, Button, InputNumber, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { formItemLayout, radioStyle } from '@/config';
import { namespace } from '../../refund/model';
import { enumRefundType } from '../../constant';
import { formatPrice, formatRMB } from '@/util/format';
import { mul } from '@/util/utils';
import ReturnShippingSelect from '../ReturnShippingSelect';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data;
}
interface State {
  visible: boolean;
}
class CheckBoth extends React.Component<Props, State> {
  state: State = {
    visible: false,
  };
  constructor(props: Props) {
    super(props);
    this.onOk = this.onOk.bind(this);
  }
  onOk() {
    this.props.form.validateFields((errors, values) => {
      if (values.serverNum == 0) {
        message.error('售后数目必须大于0');
        return;
      }
      if (values.refundAmount) {
        values.refundAmount = mul(values.refundAmount, 100)
      }
      if (!errors) {
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload: {
            id: this.props.match.params.id,
            status: 1,
            refundType: enumRefundType.Exchange,
            ...values
          },
        });
      }
    })
  }
  get data() {
    return Object.assign({}, this.props.data);
  }
  get serverNum() {
    return this.props.form.getFieldValue('serverNum');
  }
  /**
 * 输入框输入的售后金额
 */
  get refundAmount(): number {
    let result = this.props.form.getFieldValue('refundAmount');
    return mul(result, 100);
  }
  /**
 * 运费是否大于0
 */
  get hasFreight(): boolean {
    return this.checkVO.freight > 0;
  }
  /**
* 售后申请信息对象
*/
  get orderServerVO(): AfterSalesInfo.OrderServerVO {
    return Object.assign({}, this.props.data.orderServerVO);
  }
  /**
* 是否退运费
* @param 退款金额
* @param alreadyRefundAmount 已经退款金额
* @param freight 运费
*/
  get isReturnShipping(): boolean {
    let result = this.refundAmount + this.orderServerVO.alreadyRefundAmount + this.checkVO.freight === this.orderInfoVO.payMoney;
    return this.hasFreight && result;
  }
  /**
  * 售后单价
  */
  get unitPrice(): number {
    return this.checkVO.unitPrice || 0;
  }
  /**
  * 根据售后数目计算退款金额
  */
  get relatedAmount(): number {
    let result = mul(this.unitPrice, this.serverNum);
    return Math.min(result, this.checkVO.maxRefundAmount);
  }
  /**
   * 最终售后金额
   */
  get maxRefundAmount(): number {
    return this.serverNum === this.checkVO.maxServerNum ? this.checkVO.maxRefundAmount : this.relatedAmount;
  }
  /**
   * 审核信息对象
   */
  get checkVO(): AfterSalesInfo.CheckVO {
    return Object.assign({}, this.data.checkVO);
  }
  /**
   * 订单信息对象
   */
  get orderInfoVO(): AfterSalesInfo.OrderInfoVO {
    return Object.assign({}, this.data.orderInfoVO);
  }
  /**
  * 修改售后数目
  */
  handleChangeServerNum = (value: any = 0) => {
    let result = mul(this.unitPrice, value)
    this.props.form.setFieldsValue({
      refundAmount: formatPrice(result)
    })
  }
  /**
   * 获取运费
   */
  get freight() {
    return this.checkVO.freight;
  }
  get payMoney() {
    return this.orderInfoVO.payMoney;
  }
  get alreadyRefundAmount() {
    return this.orderServerVO.alreadyRefundAmount;
  }
  get showRefundBoth() {
    let isAllow = this.props.form.getFieldValue('isAllow')
    return isAllow === 1;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const checkVO = Object.assign({}, this.data.checkVO);
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
                    message: '请选择处理方式'
                  },
                ],
              })(
                <Radio.Group>
                  <Radio style={radioStyle} value={1}>
                    退款
                  </Radio>
                  <Radio style={radioStyle} value={0}>
                    拒绝退款
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            {this.showRefundBoth &&
              <>
                <Form.Item label="退货数目">
                  {getFieldDecorator('serverNum', {
                    initialValue: checkVO.serverNum,
                    rules: [
                      {
                        required: true,
                        message: '请输入退货数目'
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      max={checkVO.maxServerNum}
                      placeholder="请输入"
                      onChange={this.handleChangeServerNum}
                    />
                  )}
                  <span>（最多可售后数目{checkVO.maxServerNum}）</span>
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
                      max={formatPrice(this.maxRefundAmount)}
                      formatter={formatRMB}
                    />,
                  )}
                  <span>（最多可退￥{formatPrice(this.maxRefundAmount)}）</span>
                </Form.Item>
                {this.isReturnShipping &&
                  <Form.Item label="退运费">
                    {getFieldDecorator('isRefundFreight', {
                      initialValue: checkVO.isRefundFreight
                    })(
                      <ReturnShippingSelect checkVO={checkVO} />,
                    )}
                  </Form.Item>
                }
              </>
            }
            <Form.Item label="说    明">
              {getFieldDecorator('info')(<Input.TextArea placeholder="请输入说明" autosize={{ minRows: 3, maxRows: 5 }} />)}
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
export default withRouter(Form.create<Props>()(CheckBoth));
