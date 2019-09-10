import React, { Component } from 'react';
import { Modal, Button, Form, Input, message, Row } from 'antd';
import { getSupplierDetail, updateSupplier, addSupplier } from '../api';
import SupplierTypeSelect from '../../../components/supplier-type-select';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
class SupplierModal extends Component {
  static defaultProps = {
    onSuccess: () => { },
    id: '',
    isEdit: false,
    renderKey: 0,
  };
  state = {
    visible: false,
    data: {},
  };

  showModal = () => {
    this.props.isEdit && this.query();
    this.setState({
      visible: true,
    });
  };

  query = () => {
    getSupplierDetail({
      id: this.props.id,
    }).then(data => {
      this.setState({
        data,
        renderKey: this.state.renderKey + 1,
      });
    });
  };

  handleOk = () => {
    const { onSuccess, id, form, isEdit } = this.props;
    form.validateFields(err => {
      if (!err) {
        const api = isEdit ? updateSupplier : addSupplier;
        api({
          id,
          ...form.getFieldsValue(),
        }).then((res) => {
          if (res) {
            onSuccess && onSuccess();
            res && message.success('操作成功');
            this.setState({
              visible: false,
            });
          }
        });
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { isEdit } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { data } = this.state;

    return (
      <>
        <Button type="primary" onClick={this.showModal}>
          {isEdit ? '编辑' : '新增供应商'}
        </Button>
        <Modal
          title={isEdit ? '编辑供应商' : '新增供应商'}
          width={700}
          visible={this.state.visible}
          footer={
            <>
              <Button key="submit" type="primary" onClick={this.handleOk}>
                {isEdit ? '保存' : '新增'}
              </Button>
              <Button key="back" onClick={this.handleCancel}>
                返回
              </Button>
            </>
          }
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <Row>基本信息</Row>
            <FormItem label="供应商编码">
              {getFieldDecorator('code', { initialValue: data.code })(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="联系人">
              {getFieldDecorator('contacts', { initialValue: data.contacts })(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="供应商名称">
              {getFieldDecorator('name', { initialValue: data.name })(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="联系电话">
              {getFieldDecorator('phone', { initialValue: data.phone })(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="供应商简称">
              {getFieldDecorator('shortName', { initialValue: data.shortName })(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="联系邮箱">
              {getFieldDecorator('email', { initialValue: data.email })(<Input placeholder="" />)}
            </FormItem>
            <Row>详细信息</Row>
            <FormItem label="官网链接">
              {getFieldDecorator('jumpUrl', { initialValue: data.jumpUrl })(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="详细地址">
              {getFieldDecorator('address', { initialValue: data.address })(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="退货收件人">
              {getFieldDecorator('returnContact', {
                initialValue: data.returnContact,
                rules: [
                  {
                    required: true,
                    message: '请输入退货收件人',
                  },
                ]
              })(
                <Input placeholder="" maxlength="20" />,
              )}
            </FormItem>
            <FormItem label="退货电话">
              {getFieldDecorator('returnPhone', {
                initialValue: data.returnPhone,
                rules: [
                  {
                    required: true,
                    message: '请输入退货电话',
                  },
                ]
              })(
                <Input placeholder="" maxlength="12" />,
              )}
            </FormItem>
            <FormItem label="退货地址">
              {getFieldDecorator('returnAddress', {
                initialValue: data.returnAddress,
                rules: [
                  {
                    required: true,
                    message: '请输入退货地址',
                  },
                ]
              })(
                <Input placeholder="" maxlength="60" />,
              )}
            </FormItem>
            {/* <FormItem label="送货地址">
              {getFieldDecorator('consigneeAddress', { initialValue: data.consigneeAddress })(
                <Input placeholder="" />,
              )}
            </FormItem> */}
            <FormItem key={this.state.renderKey} label="供应商分类">
              {getFieldDecorator('category', { initialValue: data.category })(
                <SupplierTypeSelect placeholder="" />,
              )}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(SupplierModal);
