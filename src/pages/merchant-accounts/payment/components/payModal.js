import React from 'react';
import { Modal, Button, Form, Divider, Radio, Select, Input } from 'antd';
import { formatMoneyWithSign } from '@/pages/helper';
import UploadView from '@/components/upload';
import SelectFetch from '@/packages/common/components/select-fetch'
import If from '@/packages/common/components/if';
import * as api from '../../api'
import { initImgList } from '@/util/utils';
const replaceHttpUrl = imgUrl => {
  return (imgUrl || '').replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
};

const { Option } = Select;

class PayModal extends React.Component {

  handlePayConfirm = (id) => () => {
    const {
      form: { validateFields },
      handlePayConfirm
    } = this.props;
    validateFields((err, { newPaymentAccount, accountId, payType, accountName, accountNo, bankName, paymentImg }) => {
      if (err) return;
      paymentImg = paymentImg.map(o => replaceHttpUrl(o.url)).join(',')

      let params = {
        id,
        paymentImg
      }

      if (newPaymentAccount === 1) { // 已有账号
        params.accountId = accountId
      } else if (newPaymentAccount === 2) { // 新账号
        params.accountName = accountName
        params.accountNo = accountNo
        if (payType === '2') { // 银行转账
          params.bankName = bankName
        }
      }
      console.log(params)
      // api.paymentConfirm(params).then(res => {
      //   res && handlePayConfirm()
      // })
    });
  }

  /** 建议 */
  handlePayTypeChange = () => {
    this.props.form.setFieldsValue({
      accountName: undefined,
      accountNo: undefined
    })
  }

  render() {
    const {
      modalProps = {},
      form: { getFieldDecorator, getFieldValue },
      record: {
        id,
        paymentSerialNo,
        paymentImgList = [],
        paymentMoney = 0,
        paymentName,
        settlementSerialNo,
        storeTypeInfo,
        storeName,
        payTypeInfo,
        accountName,
        accountNo
      }
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    const newPaymentAccount = getFieldValue('newPaymentAccount'),
      payType = getFieldValue('payType');

    return (
      <div>
        <Modal
          title='确认付款'
          {...modalProps}
          footer={null}
          width={600}
          height={620}
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <h4>付款单信息</h4>
            <Form.Item label="付款单ID"><span>{paymentSerialNo}</span></Form.Item>
            <Form.Item label="付款单名称">{paymentName}</Form.Item>
            <Form.Item label="结算单ID">{settlementSerialNo}</Form.Item>
            <Form.Item label="金额">{formatMoneyWithSign(paymentMoney)}</Form.Item>
            <Form.Item label="结算人类型">{storeTypeInfo}</Form.Item>
            <Form.Item label="结算人名称">{storeName}</Form.Item>
            <Form.Item label="账号类型">{payTypeInfo}</Form.Item>
            <Form.Item label="账户名称">{accountName}</Form.Item>
            <Form.Item label="账号">{accountNo}</Form.Item>
            <Divider />
            <h4>实际支付信息</h4>
            <Form.Item label="支付账号">
              {getFieldDecorator('newPaymentAccount', {
                rules: [
                  {
                    required: true,
                    message: '请选择账号类型'
                  }
                ]
              })(
                <Radio.Group placeholder="请选择账号类型">
                  <Radio value={1}>已有账号</Radio>
                  <Radio value={2}>新账号</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <If condition={newPaymentAccount === 1}>
              <Form.Item label="账号选择">
                {getFieldDecorator('accountId', {
                  rules: [
                    {
                      required: newPaymentAccount === 1,
                      message: '请选择具体账号'
                    }
                  ]
                })(
                  <SelectFetch
                    placeholder="请选择账号"
                    fetchData={() => {
                      const { id } = { id: '' }
                      return api.fetchGatheringAccountList(id).then((res) => {
                        return (res || []).map((item) => {
                          return {
                            label: item.accoutName,
                            value: item.id
                          }
                        })
                      })
                    }}
                  />
                )}
              </Form.Item>
            </If>
            <If condition={newPaymentAccount === 2}>
              <Form.Item label="支付方式">
                {getFieldDecorator('payType', {
                  rules: [
                    {
                      required: newPaymentAccount === 2,
                      message: '请选择支付方式'
                    }
                  ]
                })(
                  <Select onChange={this.handlePayTypeChange} placeholder="请选择支付方式">
                    <Option value="1">支付宝</Option>
                    <Option value="2">银行转账</Option>
                  </Select>
                )}
              </Form.Item>
            </If>
            <If condition={newPaymentAccount === 2 && payType === '1'}>
              <Form.Item label="支付宝名称">
                {getFieldDecorator('accountName', {
                  rules: [
                    {
                      required: newPaymentAccount === 2 && payType === '1',
                      message: '请输入支付宝名称'
                    }
                  ]
                })(
                  <Input placeholder="请输入支付宝名称" />
                )}
              </Form.Item>
              <Form.Item label="支付宝账号">
                {getFieldDecorator('accountNo', {
                  rules: [
                    {
                      required: newPaymentAccount === 2 && payType === '1',
                      message: '请输入支付宝账号'
                    }
                  ]
                })(
                  <Input placeholder="请输入支付宝账号" />
                )}
              </Form.Item>
            </If>
            <If condition={newPaymentAccount === 2 && payType === '2'}>
              <Form.Item label="银行名称">
                {getFieldDecorator('bankName', {
                  rules: [
                    {
                      required: newPaymentAccount === 2 && payType === '2',
                      message: '请输入银行名称'
                    }
                  ]
                })(
                  <Input placeholder="请输入银行名称" />
                )}
              </Form.Item>
              <Form.Item label="账号名称">
                {getFieldDecorator('accountName', {
                  rules: [
                    {
                      required: newPaymentAccount === 2 && payType === '2',
                      message: '请输入账号名称'
                    }
                  ]
                })(
                  <Input placeholder="请输入账号名称" />
                )}
              </Form.Item>
              <Form.Item label="银行账号">
                {getFieldDecorator('accountNo', {
                  rules: [
                    {
                      required: newPaymentAccount === 2 && payType === '2',
                      message: '请输入银行账号'
                    }
                  ]
                })(
                  <Input placeholder="请输入银行账号" />
                )}
              </Form.Item>
            </If>
            <Form.Item label="凭证"
              help={
                <>
                  <div>1.本地上传图片大小不能超过2M</div>
                  <div>2.商品图片最多上传5张图片</div>
                </>
              }>
              {getFieldDecorator('paymentImg', {
                initialValue: [].concat(paymentImgList.filter(item => !!item).map(item => initImgList(item)[0])),
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <UploadView
                  listNum={5}
                  placeholder="上传凭证"
                  listType="picture-card"
                  size={2}
                  fileType={['jpg', 'jpeg', 'gif', 'png']}
                />,
              )}
            </Form.Item>
            {
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: '20px'
                }}
              >
                <Button
                  type="primary"
                  onClick={this.handlePayConfirm(id)}
                >
                  确认支付
                </Button>
              </div>
            }
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(PayModal);