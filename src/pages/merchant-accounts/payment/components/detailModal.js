import React from 'react';
import { Modal, Form, Button } from 'antd';
import { formatMoneyWithSign } from '@/pages/helper';
import UploadView from '@/components/upload';
import { initImgList } from '@/util/utils';
import * as api from '../../api'
const replaceHttpUrl = imgUrl => {
  return (imgUrl || '').replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
};

class DetailModal extends React.Component {

  handleSave = (id) => () => {
    const {
      form: { validateFields },
      record: { paymentImgList = [] }
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
          res && console.log(12)
        })
    });
  }

  render() {
    const {
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

    let uploadProps = {
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: false,
        showDownloadIcon: false
      }
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
            <Form.Item label="付款单ID"><span>{paymentSerialNo}</span></Form.Item>
            <Form.Item label="付款单名称">{paymentName}</Form.Item>
            <Form.Item label="结算单ID">{settlementSerialNo}</Form.Item>
            <Form.Item label="金额">{formatMoneyWithSign(paymentMoney)}</Form.Item>
            <Form.Item label="凭证">
              {getFieldDecorator('paymentImg', {
                initialValue: [].concat(paymentImgList.map(item => initImgList(item)[0]))
              })(
                <UploadView
                  {...uploadProps}
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
                  onClick={this.handleSave(id)}
                >
                  保存
                </Button>
              </div>
            }
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DetailModal);