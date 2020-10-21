import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Modal, Radio, Button, InputNumber, Input, message, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { radioStyle } from '@/config';
import { namespace } from '../../refund/model';
import { enumRefundType } from '../../constant';
import { formatPrice, formatRMB } from '@/util/format';
import { mul } from '@/util/utils';
import ReturnShippingSelect from '../ReturnShippingSelect';
import ReturnCouponSelect from '../ReturnCouponSelect'
import { verifyDownDgrade } from '@/pages/order/api';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  data: AfterSalesInfo.data;
}
interface State {
  visible: boolean;
  isDemotion: number;
  demotionInfo: string;
}
class CheckBoth extends React.Component<Props, State> {
  state: State = {
    visible: false,
    isDemotion: this.checkVO.isDemotion,
    demotionInfo: ''
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
      if (!this.isReturnShipping || values.isAllow === 0) {
        values.isRefundFreight = 0
      }
      if (!errors) {
        APP.dispatch({
          type: `${namespace}/auditOperate`,
          payload: {
            id: this.props.match.params.id,
            status: 1,
            refundType: enumRefundType.Both,
            ...values
          },
        });
      }
    })
  }
  get data() {
    return this.props.data || {};
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
    return this.props.data.orderServerVO || {};
  }
  /**
* 是否退运费
* @param 退款金额
* @param alreadyRefundAmount 已经退款金额
* @param freight 运费
*/
  get isReturnShipping(): boolean {
    // let result = this.refundAmount + this.orderServerVO.alreadyRefundAmount + this.checkVO.freight === this.orderInfoVO.payMoney;
    // return this.hasFreight && result;

    const result = this.refundAmount === this.checkVO.maxRefundAmount && this.checkVO.serverNum === this.serverNum;
    // let result = this.refundAmount + this.orderServerVO.alreadyRefundAmount + this.checkVO.freight === this.orderInfoVO.payMoney;
    return this.hasFreight && this.checkVO.isRefundFreight === 1 && result;
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
    const refundCouponAmount = this.props.form.getFieldValue('refundCouponAmount')
    let maxRefundAmount = this.serverNum === this.checkVO.maxServerNum ? this.checkVO.maxRefundAmount : this.relatedAmount;
    if (refundCouponAmount === 1) {
      maxRefundAmount = maxRefundAmount - this.orderServerVO.deductionAmount
    }
    return maxRefundAmount
  }
  /**
   * 审核信息对象
   */
  get checkVO(): AfterSalesInfo.CheckVO {
    return this.data.checkVO || {};
  }
  /**
   * 订单信息对象
   */
  get orderInfoVO(): AfterSalesInfo.OrderInfoVO {
    return this.data.orderInfoVO || {};
  }
  /**
  * 修改售后数目
  */
  handleChangeServerNum = (value: any = 0) => {
    let result = mul(this.unitPrice, value)
    this.props.form.setFieldsValue({
      refundAmount: formatPrice(result)
    }, () => {
      this.verifyMaxRefundAmount(result);
    })
  }
   /**
   * 验证是否会降级
   */
  verifyMaxRefundAmount = (value: number) => {
    console.log('最终退款金额', value)
    console.log('verifyMaxRefundAmount', this.props.data.orderInfoVO)
    verifyDownDgrade({
      orderMainId: this.props.data.orderInfoVO.mainOrderId,
      refundType: enumRefundType.Refund,
      amount: value
    }).then((res: any) => {
      console.log('verifyMaxRefundAmount', res)
      this.setState({
        isDemotion: res ? 1 : 0  //true会降级
      })
    })
  }
  /**
   * 降级改变
   */
  onChangeJiangji = (e: any) => {
    console.log('onChangeJiangji', e)
    this.setState({
      isDemotion: e.target.value
    })
  }
  /**
   * 退款金额变动
   */
  handleChangeMaxRefundAmount = (value: number = 0) => {
    this.verifyMaxRefundAmount(value*100);
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
    const { getFieldDecorator } = this.props.form
    const checkVO = this.data.checkVO || {}
    /** 是否是海淘订单 */
    const isHaiTao = Number(this.orderInfoVO.orderType) === 70

    const isXiaoDian = this.data.shopDTO && this.data.shopDTO.shopType === 2

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    
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
            {
              this.orderServerVO.deductionAmount && (
                <Form.Item label='是否回收优惠券金额'>
                  {getFieldDecorator('refundCouponAmount', {
                    rules: [
                      {
                        required: true,
                        message: '请选择'
                      }
                    ]
                  })(
                    <ReturnCouponSelect
                      deductionAmount={this.orderServerVO.deductionAmount}
                      onChange={() => {
                        this.props.form.setFieldsValue({
                          refundAmount: this.maxRefundAmount
                        })
                      }}
                    />
                  )}
                </Form.Item>
              )
            }
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
                      className='not-has-handler'
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
                      min={0}
                      max={formatPrice(this.maxRefundAmount)}
                      disabled={isHaiTao || isXiaoDian}
                      formatter={formatRMB}
                      onChange={this.handleChangeMaxRefundAmount}
                    />,
                  )}
                  <span>（最多可退￥{`${formatPrice(this.maxRefundAmount)}${isHaiTao ? '，已包含税费': ''}`}）</span>
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
              {getFieldDecorator('info')(<Input.TextArea placeholder="请输入说明" autoSize={{ minRows: 3, maxRows: 5 }} />)}
            </Form.Item>
            {
              this.state.isDemotion > 0 && this.showRefundBoth &&
              <Row>
                <Form.Item label="团长降级">
                  {getFieldDecorator('isDemotion', {
                    initialValue: this.checkVO.isDemotion,
                  })(
                    <Radio.Group onChange={this.onChangeJiangji} value={this.state.isDemotion}>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Row>
            }
            
            {
              this.state.isDemotion === 2 && this.showRefundBoth &&
                <Row>
                  <Form.Item label="不降级原因">
                    {getFieldDecorator('demotionInfo', {
                      initialValue: this.checkVO.demotionInfo,
                      rules: [
                        {
                          required: true,
                          message: '请输入原因',
                        },
                      ],
                    })(
                      <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />,
                    )}
                  </Form.Item>
              </Row>
            }
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
