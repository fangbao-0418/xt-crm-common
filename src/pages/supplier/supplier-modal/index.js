import React, { Component } from 'react';
import { Modal, Button, Form, Input, message, Row } from 'antd';
import { getSupplierDetail, updateSupplier, addSupplier } from '../api';
import SupplierTypeSelect from '../../../components/supplier-type-select';
import SaleArea from '@/components/sale-area';
import { If } from '@/packages/common/components';
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
    saleAreaVisible: false,
    data: {}
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
      
      this.props.form && this.props.form.setFieldsValue(data);
    });
  };

  handleOk = () => {
    const { onSuccess, id, form, isEdit } = this.props;
    form.validateFields(err => {
      if (!err) {
        const api = isEdit ? updateSupplier : addSupplier;
        api({
          id,
        //   saleAreaList: [{
        //     "city": "杭州市",
        //     "cityId": 1,
        //     "district": "余杭区",
        //     "districtId": 1,
        //     "name": "浙江省杭州市余杭区",
        //     'id': 1,
        //     "province": "浙江省",
        //     "provinceId": 1
        // }],
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
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  message: '请输入供应商编码'
                }]
              })(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="联系人">
              {getFieldDecorator('contacts',)(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="供应商名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入供应商名称'
                }]
              })(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="联系电话">
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入联系电话'
                }]
              })(<Input placeholder="" maxLength={11}/>)}
            </FormItem>
            <FormItem label="供应商简称">
              {getFieldDecorator('shortName')(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="联系邮箱">
              {getFieldDecorator('email')(<Input placeholder="" />)}
            </FormItem>
            <Row>详细信息</Row>
            <FormItem label="官网链接">
              {getFieldDecorator('jumpUrl')(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="详细地址">
              {getFieldDecorator('address', )(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="退货收件人">
              {getFieldDecorator('returnContact', {
                
                rules: [
                  {
                    required: true,
                    message: '请输入退货收件人',
                  },
                ]
              })(
                <Input placeholder="" maxLength={20} />,
              )}
            </FormItem>
            <FormItem label="退货电话">
              {getFieldDecorator('returnPhone', {
              
                rules: [
                  {
                    required: true,
                    message: '请输入退货电话',
                  },
                ]
              })(
                <Input placeholder="" maxLength={12} />,
              )}
            </FormItem>
            <FormItem label="退货地址">
              {getFieldDecorator('returnAddress', {
          
                rules: [
                  {
                    required: true,
                    message: '请输入退货地址',
                  },
                ]
              })(
                <Input placeholder="" maxLength={60} />,
              )}
            </FormItem>
            {/* <FormItem label="送货地址">
              {getFieldDecorator('consigneeAddress', { initialValue: data.consigneeAddress })(
                <Input placeholder="" />,
              )}
            </FormItem> */}
            <FormItem key={this.state.renderKey} label="供应商分类">
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
                  console.log(+value === 5);
                  this.setState({
                    saleAreaVisible: +value === 5
                  })
                  return value;
                }
              })(
                <SupplierTypeSelect />
              )}
            </FormItem>
            <If condition={this.state.saleAreaVisible}>
              <FormItem required label='可售区域'>
                {getFieldDecorator('saleAreaList')(<SaleArea />)}
              </FormItem>
            </If>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(SupplierModal);
