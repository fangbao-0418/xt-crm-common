import React from 'react';
import { Modal, Form, Button, Divider } from 'antd';
import { formatMoneyWithSign } from '@/pages/helper';
import UploadView from '@/components/upload';
import { initImgList } from '@/util/utils';
import If from '@/packages/common/components/if';
import * as api from '../../api'
const replaceHttpUrl = imgUrl => {
  return (imgUrl || '').replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
};

class DetailModal extends React.Component {

  handleSave = (id) => () => {
    const {
      form: { validateFields },
      record: { paymentImgList = [] },
      handlePayUpload
    } = this.props;
    validateFields((err, { paymentImg }) => {
      if (err) return;
      paymentImg = paymentImg.map(o => replaceHttpUrl(o.url))
      paymentImg = paymentImg.filter(item => !paymentImgList.includes(item))
      console.log(paymentImg)
      api
        .paymentUpload({
          id,
          paymentImg
        })
        .then(res => {
          res && handlePayUpload()
        })
    });
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
        storeTypeInfo = '暂无数据',
        storeName = '暂无数据',
        payTypeInfo = '暂无数据',
        accountName = '暂无数据',
        accountNo = '暂无数据',
        financePaymentAccountVO = {}
      },
      detailModalUpload
    } = this.props;

    let uploadProps = {
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: false,
        showDownloadIcon: false
      }
    }

    if (detailModalUpload) {
      uploadProps.listNum = 5
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    let paymentImg = getFieldValue('paymentImg') || [];

    paymentImg = paymentImg.map(o => replaceHttpUrl(o.url))
    paymentImg = paymentImg.filter(item => !paymentImgList.includes(item))

    return (
      <div>
        <Modal
          title="查看明细"
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
            <Form.Item label="支付信息">
              <p>{financePaymentAccountVO.payTypeInfo}</p>
              <If condition={financePaymentAccountVO.payType === 20}>
                <p>{financePaymentAccountVO.bankName}</p>
              </If>
              <p>{financePaymentAccountVO.accountName}</p>
              <p>{financePaymentAccountVO.accountNo}</p>
            </Form.Item>
            <Form.Item label="凭证">
              {getFieldDecorator('paymentImg', {
                initialValue: [].concat(paymentImgList.filter(item => !!item).map(item => initImgList(item)[0]))
              })(
                <UploadView
                  {...uploadProps}
                  placeholder="上传凭证"
                  listType="picture-card"
                  size={2}
                  fileType={['jpg', 'jpeg', 'gif', 'png']}
                />,
              )}
            </Form.Item>
            <If condition={detailModalUpload}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: '20px'
                }}
              >
                <Button
                  disabled={!paymentImg.length}
                  type="primary"
                  onClick={this.handleSave(id)}
                >
                  保存
                </Button>
              </div>
            </If>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DetailModal);