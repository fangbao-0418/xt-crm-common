import React from 'react';
import { Modal, Button, Form, Row, Col} from 'antd';
import styles from '../../goods/edit.module.scss'
import DraggableUpload from '../../goods/components/draggable-upload'
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
class PayModal extends React.Component {
  componentDidMount() {
    const {form:{ setFieldsValue } } = this.props;
    console.log('setFieldsValue')
    console.log(setFieldsValue)
    setFieldsValue({
      productImage:[
        {
          durl: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          name: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          status: "done",
          thumbUrl: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          uid: "9122070205113291",
          url: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png"
        },
        {
          durl: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          name: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          status: "done",
          thumbUrl: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          uid: "9122070205113291",
          url: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png"
        }, {
          durl: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          name: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          status: "done",
          thumbUrl: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png",
          uid: "9122070205113291",
          url: "https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551581328838803.png"
        }
      ]
    })
  }
  handlePayConfirm = () => {
    const {
      form:{validateFields },
      handlePayConfirm
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        console.log(vals)
        
      }
    });
  }
  render() {
    const {
      modalProps={},
      form:{ getFieldDecorator, setFieldsValue },
      record: {
        id,
        paymentName,
        settId,
        paymentMoney
      }
    } = this.props;

    return (
      <div>
        <Modal
          title="Title"
          {...modalProps}
          footer={null}
        >
            <Form {...formLayout}>
              <Form.Item label="付款单ID">{id}</Form.Item>
              <Form.Item label="付款单名称">{paymentName}</Form.Item>
              <Form.Item label="结算单ID">{settId}</Form.Item>
              <Form.Item label="金额">￥{paymentMoney}</Form.Item>
              <Form.Item
                label="凭证"
                required={modalProps.title==='确认付款'}
                help={
                  <>
                    <div>1.本地上传图片大小不能超过2M</div>
                    <div>2.商品图片最多上传5张图片</div>
                  </>
                }
              >
                {getFieldDecorator('productImage', {
                  rules: [
                    {
                      required: true,
                      message: '请上传凭证图片',
                    },
                  ],
                })(
                  <div style={{float: 'left'}}>
                  <DraggableUpload className={styles['goods-detail-draggable']} listNum={5} size={0.3} placeholder="上传凭证" /> 
                  </div>
                )}
              </Form.Item>
              <Row style={{ display: "flex", justifyContent: "center" }}>
                <Button type="primary" onClick={this.handlePayConfirm}>确认支付</Button>
              </Row>
            </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(PayModal);