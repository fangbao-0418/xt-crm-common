import React, { Component } from 'react';
import { Modal, Button, Form, Input, message, Row } from 'antd';
import { getSupplierDetail, updateSupplier, addSupplier } from '../api';
import SupplierTypeSelect from '@/components/supplier-type-select';
import { If } from '@/packages/common/components'
import SaleArea from '@/components/sale-area';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
class SupplierModal extends Component {
  static defaultProps = {
    id: '',
    isEdit: false
  };
  state = {
    visible: false,
    saleAreaVisible: false
  }

  showModal = () => {
    this.props.isEdit && this.query();
    this.setState({
      visible: true
    });
  }

  query = () => {
    getSupplierDetail({
      id: this.props.id,
    }).then((data) => {
      if (data.category === 5) {
        this.setState({
          saleAreaVisible: true
        })
      }
      this.props.form && this.props.form.setFieldsValue(data);
    });
  }

  handleOk = () => {
    const { onSuccess, id, form, isEdit } = this.props;
    form.validateFields((err, vals) => {
      if (!err) {
        const api = isEdit ? updateSupplier : addSupplier;
        api({
          id,
          ...vals,
        }).then((res) => {
          if (res) {
            onSuccess && onSuccess();
            res && message.success('操作成功');
            this.handleCancel()
          }
        });
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      saleAreaVisible: false
    })
    this.props.form && this.props.form.resetFields()
  }
  render() {
    const { isEdit } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const category = getFieldValue('category');

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
            {/* <If condition={category !== 6}>
              <FormItem label="供应商编码">
                {getFieldDecorator('code', {
                  rules: [{
                    required: category !== 6,
                    message: '请输入供应商编码'
                  }]
                })(<Input placeholder="请输入供应商编码" />)}
              </FormItem>
            </If> */}
            <FormItem label="联系人">
              {getFieldDecorator('contacts')(
                <Input placeholder="请输入联系人" />,
              )}
            </FormItem>
            <FormItem label="供应商名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入供应商名称'
                }]
              })(<Input placeholder="请输入供应商名称" />)}
            </FormItem>
            <FormItem label="联系电话">
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入联系电话'
                }]
              })(<Input placeholder="请输入联系电话" maxLength={11} />)}
            </FormItem>
            <FormItem label="供应商简称">
              {getFieldDecorator('shortName')(
                <Input placeholder="请输入供应商简称" />,
              )}
            </FormItem>
            <FormItem label="联系邮箱">
              {getFieldDecorator('email')(<Input placeholder="请输入联系邮箱" />)}
            </FormItem>
            <Row>详细信息</Row>
            <FormItem label="官网链接">
              {getFieldDecorator('jumpUrl')(
                <Input placeholder="请输入官网链接" />,
              )}
            </FormItem>
            <FormItem label="详细地址">
              {getFieldDecorator('address')(
                <Input placeholder="请输入详细地址" />,
              )}
            </FormItem>
            {/* <FormItem label="退货收件人">
              {getFieldDecorator('returnContact')(
                <Input placeholder="请输入退货收件人" maxLength={20} />,
              )}
            </FormItem>
            <FormItem label="退货电话">
              {getFieldDecorator('returnPhone')(
                <Input placeholder="请输入退货电话" maxLength={12} />,
              )}
            </FormItem>
            <FormItem label="退货地址">
              {getFieldDecorator('returnAddress')(
                <Input placeholder="请输入退货地址" maxLength={60} />,
              )}
            </FormItem> */}
            <FormItem label="供应商分类">
              {getFieldDecorator('category', {
                rules: [
                  {
                    required: true,
                    message: '请选择供应商分类'
                  }
                ],
                getValueFromEvent: (e) => {
                  let value
                  if (!e || !e.target) {
                    value = e;
                  } else {
                    const { target } = e;
                    value = target.type === 'checkbox' ? target.checked : target.value;
                  }
                  this.setState({
                    saleAreaVisible: +value === 5
                  })
                  return value;
                }
              })(
                <SupplierTypeSelect disabled={this.props.isEdit} />
              )}
            </FormItem>
            {this.state.saleAreaVisible && (
              <FormItem required label='可售区域'>
                {getFieldDecorator('saleAreaList', {
                  rules: [{
                    validator: async (rules, value) => {
                      console.log('value =>', value)
                      if (!value || Array.isArray(value) && value.length === 0) {
                        throw new Error('请选择可售区域')
                      }
                      return value
                    }
                  }]
                })(
                  <SaleArea readOnly={this.props.isEdit} />
                )}
              </FormItem>
            )}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(SupplierModal);
