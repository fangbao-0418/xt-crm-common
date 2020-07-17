import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Form, Input, InputNumber, Card, Modal, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { formatPrice } from '@/util/format'
import UploadView from '@/components/upload'
import { XtSelect } from '@/components'
import { formItemLayout } from '@/config'
import { mul } from '@/util/utils'
import { customerAdd } from '../../api'
import MoneyRender from '@/components/money-render'
import GoodCell from '@/components/good-cell'
const { TextArea } = Input

const getDetailColumns = (type = 0) => {
  return [
    {
      title: '商品',
      dataIndex: 'skuName',
      key: 'skuName',
      render (skuName: string, row: any) {
        return <GoodCell {...row} isRefund={type === 1} />
      }
    },
    {
      title: '单价',
      dataIndex: 'productUnitPrice',
      key: 'productUnitPrice',
      render: MoneyRender
    },
    {
      title: '购买价',
      dataIndex: 'orderBuyAmount',
      key: 'orderBuyAmount',
      render: MoneyRender
    },
    {
      title: '数量',
      dataIndex: 'buyNum',
      key: 'buyNum'
    },
    {
      title: '优惠',
      dataIndex: 'discountPrice',
      key: 'discountPrice',
      render: MoneyRender
    },
    {
      title: '实际支付',
      dataIndex: 'orderTotalAmount',
      key: 'orderTotalAmount',
      render: MoneyRender
    }
  ]
}

interface Props extends FormComponentProps {
  modalInfo: any;
  successCb: () => void;
  onCancel: () => void;
  visible: boolean;
}
interface State {}

class ApplyAfterSale extends React.Component<Props, State> {
  state: State = {};
  handleOk = () => {
    const {
      form: { validateFields },
      modalInfo
    } = this.props
    validateFields(async (errors, values) => {
      if (!errors) {
        if (values.serverNum == 0) {
          message.error('售后数目必须大于0')
          return
        }
        values.refundImg = Array.isArray(values.refundImg) ? values.refundImg.map((v: any) => v.url) : []
        values.refundImg = values.refundImg.map((urlStr: string) =>
          urlStr.replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', ''))
        if (values.refundMoney) {
          values.refundMoney = mul(values.refundMoney, 100)
        }
        const params = {
          childOrderId: modalInfo.childOrderId,
          mainOrderId: modalInfo.mainOrderId,
          childOrderCode: modalInfo.childOrderCode,
          ...values
        }
        const res: any = await customerAdd(params)
        if (res) {
          message.success('申请售后成功')
          this.props.successCb()
        }
      }
    })
  };
  handleChangeServerNum = (value: any = 1) => {
    const {
      modalInfo,
      form: { setFieldsValue }
    } = this.props
    let maxUnitRefundMoney = modalInfo.maxRefundMoney
    if (value === modalInfo.maxServerNum) {
      maxUnitRefundMoney = modalInfo.maxRefundMoney
    } else {
      maxUnitRefundMoney = value * modalInfo.maxUnitRefundMoney
    }
    setFieldsValue({
      refundMoney: formatPrice(maxUnitRefundMoney)
    })
  }
  render () {
    const {
      modalInfo,
      form: { getFieldDecorator, getFieldValue }
    } = this.props
    const refundTypeOptions = Object.entries(modalInfo.refundReasonS || {}).map(item => ({ key: item[0], val: item[1] }))

    const serverNum = getFieldValue('serverNum')

    let maxUnitRefundMoney = modalInfo.maxRefundMoney
    if (serverNum) {
      if (serverNum === modalInfo.maxServerNum) {
        maxUnitRefundMoney = modalInfo.maxRefundMoney
      } else {
        maxUnitRefundMoney = serverNum * modalInfo.maxUnitRefundMoney
      }
    }

    return (
      <Modal
        width='80%'
        style={{ top: 20, minWidth: '900px' }}
        title='申请售后'
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
      >
        <Table dataSource={[modalInfo]} columns={getDetailColumns()} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            <Form.Item label='售后原因'>
              {getFieldDecorator('returnReason', {
                rules: [
                  {
                    required: true,
                    message: '请选择售后原因'
                  }
                ]
              })(<XtSelect data={refundTypeOptions} />)}
            </Form.Item>
            <Form.Item label='售后数目'>
              {getFieldDecorator('serverNum', {
                rules: [{ required: true, message: '请填写售后数目' }],
                initialValue: modalInfo.maxServerNum
              })(
                <InputNumber
                  className='not-has-handler'
                  min={1}
                  max={modalInfo.maxServerNum}
                  placeholder='请输入'
                  onChange={this.handleChangeServerNum}
                />
              )}
              （最多可售后数目：{modalInfo.maxServerNum}）
            </Form.Item>
            <Form.Item label='售后金额'>
              {getFieldDecorator('refundMoney', {
                rules: [{ required: true, message: '请输入售后金额' }],
                initialValue: formatPrice(maxUnitRefundMoney)
              })(
                <InputNumber
                  min={0}
                  max={formatPrice(maxUnitRefundMoney)}
                />
              )}
              <span className='ml10'>
                （最多可退￥{`${formatPrice(maxUnitRefundMoney)}`}）
              </span>
            </Form.Item>
            <Form.Item label='售后凭证'>
              {getFieldDecorator('refundImg')(<UploadView placeholder='' listType='picture-card' listNum={4} size={2} />)}
            </Form.Item>
            <Form.Item label='售后说明'>{getFieldDecorator('info', {})(<TextArea />)}</Form.Item>
          </Form>
        </Card>
      </Modal>
    )
  }
}
export default Form.create()(ApplyAfterSale)
