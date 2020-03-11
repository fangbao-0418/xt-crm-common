import React from 'react';
import { Modal, Form } from 'antd';
import { formatMoneyWithSign } from '@/pages/helper';
import UploadView from '@/components/upload';
import { initImgList } from '@/util/utils';

class DetailModal extends React.Component {

  render() {
    const {
      modalProps = {},
      form: { getFieldDecorator },
      record: {
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
                  placeholder="上传凭证"
                  listType="picture-card"
                  size={2}
                  fileType={['jpg', 'jpeg', 'gif', 'png']}
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DetailModal);