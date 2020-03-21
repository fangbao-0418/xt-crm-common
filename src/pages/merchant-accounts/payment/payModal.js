import React from 'react';
import { Modal, Button, Form, Row, Col } from 'antd';
import { formatMoneyWithSign } from '@/pages/helper';
import UploadView from '@/components/upload';
import * as api from '../api'
import { getAllId, gotoPage, initImgList } from '@/util/utils';
const replaceHttpUrl = imgUrl => {
  return (imgUrl || '').replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
};

class PayModal extends React.Component {


  handlePayConfirm = (id) => () => {
    const {
      form: { validateFields },
      handlePayConfirm
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        const paymentImg = vals.paymentImg.map(o => replaceHttpUrl(o.url)).join(',')
        api.paymentConfirm({ id, paymentImg }).then(res => {
          res && handlePayConfirm()
        })
      }
    });
  }
  render() {
    const {
      modalType,
      modalProps = {},
      form: { getFieldDecorator },
      record: {
        id,
        paymentSerialNo,
        paymentImgList = [],
        paymentMoney = 0,
        paymentName,
        settlementSerialNo,
      }
    } = this.props;
    let uploadProps = modalType === 'look' ? { showUploadList: { showPreviewIcon: true, showRemoveIcon: false, showDownloadIcon: false } } : { listNum: 5 }

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

    return (
      <div>
        <Modal
          title={modalType === 'look' ? '查看明细' : '确认付款'}
          {...modalProps}
          footer={null}
          width={600}
          height={620}
          destroyOnClose
        >
          <Form {...formItemLayout}>
            <Form.Item label="付款单ID"><span>{paymentSerialNo}</span></Form.Item>
            <Form.Item label="付款单名称">{paymentName}</Form.Item>
            <Form.Item label="结算单ID">{settlementSerialNo}</Form.Item>
            <Form.Item label="金额">{formatMoneyWithSign(paymentMoney)}</Form.Item>
            <Form.Item label="凭证"
              help={modalType === 'confirm' ?
                <>
                  <div>1.本地上传图片大小不能超过2M</div>
                  <div>2.商品图片最多上传5张图片</div>
                </> : null
              }>
              {getFieldDecorator('paymentImg', {
                initialValue: [].concat(paymentImgList.map(item => initImgList(item)[0]))
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
            {
              modalType === 'confirm' && (<Row style={{ display: "flex", justifyContent: "center", marginTop: '20px' }}>
                <Button type="primary" onClick={this.handlePayConfirm(id)}>确认支付</Button>
              </Row>)
            }

          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(PayModal);