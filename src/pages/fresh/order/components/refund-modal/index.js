import React, { Component } from 'react';
import { Modal, Button, Form, Card, Input, InputNumber, message, Table } from 'antd';
import moment from 'moment';
import { refundOperate, getRefundOrderInfo, refundAgain, closeRefund } from '../../api';
import RefundInfo from './refund-info';
import RefundTypeSelect from '../refund-type-select';
import { enumRefundType, enumRefundStatus } from '../../constant';
import { formatMoneyBeforeRequest } from '@/helper';
import RefundStatusCell from '../refund-status-cell';
import { dateFormat } from '@/util/utils';

const FormItem = Form.Item;

const { TextArea } = Input;

const enumOperateType = {
  Agree: 1,
  Reject: 0,
};
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const column = [
  {
    title: '前操作状态',
    dataIndex: 'beforeStatus',
    render(beforeStatus, row) {
      return <RefundStatusCell refundStatus={beforeStatus} />;
    },
  },
  {
    title: '后操作状态',
    dataIndex: 'afterStatus',
    render(afterStatus, row) {
      return <RefundStatusCell refundStatus={afterStatus} />;
    },
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    render(value) {
      return value ? moment(value).format(dateFormat) : '';
    },
  },
  {
    title: '备注',
    dataIndex: 'info',
  },
  {
    title: '操作人',
    dataIndex: 'operator',
  },
];
class RefundModal extends Component {
  static defaultProps = {
    onSuccess: () => {},
    orderCode: '',
    // refundId: '',
  };
  state = {
    visible: false,
    data: {},
  };

  showModal = () => {
    this.query();
    this.setState({
      visible: true,
    });
  };

  query = () => {
    const { id } = this.props;
    getRefundOrderInfo({
      id
    }).then((res = {}) => {
      this.setState({
        data: res.data || {}
      });
    });
  };

  operateOrder = status => {
    const { onSuccess, orderCode, id, refundId, skuId, form } = this.props;
    form.validateFields(err => {
      if (!err) {
        let params = {
          id,
          status,
          refundId,
          skuId,
          orderCode,
          ...form.getFieldsValue(),
        };
        params.refundAmount = formatMoneyBeforeRequest(params.refundAmount);
        refundOperate(params).then((res = {}) => {
          onSuccess && onSuccess();
          res.success && message.success('操作成功');
          this.setState({
            visible: false,
          });
        });
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  // 重新退款
  refundAgain = () => {
    const { id, onSuccess } = this.props;
    refundAgain({ id }).then((res) => {
      if (res) {
        message.success('操作成功');
        this.setState({
          visible: false,
        });
        onSuccess && onSuccess();
      }
    })
  }

  // 关闭订单
  closeRefund = () => {
    const { id, onSuccess } = this.props;
    closeRefund({ id }).then((res) => {
      if (res) {
        message.success('操作成功');
        this.setState({
          visible: false,
        });
        onSuccess && onSuccess();
      }
    })
  }
  render() {
    const { readOnly } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { data = {} } = this.state;
    const currentRefundType = getFieldValue('refundType');
    const infoRule =
      currentRefundType && currentRefundType !== data.refundType
        ? [{ required: true, message: '你已更改售后类型，备注必填!' }]
        : [];
    const isFailed = data.refundStatus === 21; // 退款失败状态
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          { readOnly ? '查看' : '审核' }
        </Button>
        <Modal
          title={ readOnly ? '查看' : '审核' }
          width={700}
          visible={this.state.visible}
          destroyOnClose
          footer={
            !readOnly ?
            <>
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  !isFailed ? this.operateOrder(enumOperateType.Agree) : this.closeRefund();
                }}
              >
                { !isFailed ? '同意' : '订单完成' }
              </Button>
              {
                !isFailed ?
                <Button
                  key="reject"
                  type="danger"
                  onClick={() => {
                    this.operateOrder(enumOperateType.Reject)
                  }}
                >
                  拒绝
              </Button> :
              <Button
                key="reject"
                type="danger"
                onClick={() => {
                  this.refundAgain();
                }}
              >
                重新退款
              </Button>
              }
              <Button key="back" onClick={this.handleCancel}>
                返回
              </Button>
            </> : ''
          }
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <RefundInfo data={data} />
          <Card title="操作区域">
            <Form {...formItemLayout}>
              <FormItem label="售后类型">
                {getFieldDecorator('refundType', { initialValue: data.refundType })(
                   readOnly ? <span>{data.refundTypeStr}</span> : <RefundTypeSelect />,
                )}
              </FormItem>
              {([enumRefundType.Both, enumRefundType.Refund].indexOf(
                currentRefundType || data.refundType,
              ) > -1) && (
                <FormItem label="退款金额">
                  {getFieldDecorator('refundAmount', {
                    initialValue: data.refundAmount / 100,
                    rules: [
                      {
                        type: 'number',
                        message: '金额只能输入数字'
                      }
                    ]
                  })(
                    <InputNumber
                      placeholder={readOnly ? '' : '请输入退款金额'}
                      min={0}
                      // 订单状态非待审核，退款失败，退货中,退款退货中则不可操作
                      disabled={readOnly || ![enumRefundStatus.WaitConfirm, enumRefundStatus.OperatingFailed, enumRefundStatus.OperatingOfGoods, enumRefundStatus.OperatingAll].includes(data.refundStatus)} />,
                  )}
                </FormItem>
              )}
              <FormItem label="备注">
                {getFieldDecorator('info', {
                  initialValue: data.serverDescribe,
                  rules: infoRule,
                })(<TextArea placeholder={readOnly ? '' : '请输入备注'} disabled={readOnly}/>)}
              </FormItem>
            </Form>
          </Card>
          <Table columns={column} dataSource={data.logList || []} pagination={false} title={() => '操作记录'} />
        </Modal>
      </div>
    );
  }
}

export default Form.create()(RefundModal);
