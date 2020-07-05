import React, { Component } from 'react'
import { Modal, Button, Form, Input, message, Radio, Select } from 'antd'
import { If } from '@/packages/common/components'
import { getSupplierDetail, updateSupplier, addSupplier } from '../api'
import UploadView from '@/components/upload'
import SupplierTypeSelect from '@/components/supplier-type-select'
import SaleArea from '@/components/sale-area'
const FormItem = Form.Item

const getInitImage = (url) => {
  if (url) {
    return [
      {
        uid: url,
        url: url,
        status: 'done',
        thumbUrl: url
      }
    ]
  }

  return []
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}
class SupplierModal extends Component {
  static defaultProps = {
    id: '',
    isEdit: false
  };
  state = {
    visible: false,
    saleAreaVisible: false,
    category: 0
  }

  showModal = () => {
    this.props.isEdit && this.query()
    this.setState({
      visible: true
    })
  }

  query = () => {
    getSupplierDetail({
      id: this.props.id
    }).then((data) => {
      this.setState({
        category: data.category,
        saleAreaVisible: data.category === 5
      })
      this.props.form && this.props.form.setFieldsValue({
        ...data,
        shopName: (data.shopName || '').replace('喜团自营店', ''),
        shopUrl: getInitImage(data.shopUrl)
      })
    })
  }

  handleOk = () => {
    const { onSuccess, id, form, isEdit } = this.props
    form.validateFields((err, { category, shopUrl, shopName, ...vals }) => {
      if (!err) {
        const api = isEdit ? updateSupplier : addSupplier
        vals.freezeLimit = vals.freezeLimit !== undefined ? Number(vals.freezeLimit) : undefined
        if ([0, 1, 2, 3, 4].includes(category)) {
          vals.shopUrl = shopUrl[0].rurl
          vals.shopName = shopName
        }
        api({
          id,
          category,
          ...vals
        }).then((res) => {
          if (res) {
            onSuccess && onSuccess()
            res && message.success('操作成功')
            this.handleCancel()
          }
        })
      }
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      saleAreaVisible: false
    })
    this.props.form && this.props.form.resetFields()
  }
  render () {
    const { isEdit } = this.props
    const { getFieldDecorator, getFieldsValue } = this.props.form
    const { category, showType } = this.props.form.getFieldsValue(['category', 'showType'])
    return (
      <>
        <Button type='primary' onClick={this.showModal}>
          {isEdit ? '编辑' : '新增供应商'}
        </Button>
        <Modal
          title={isEdit ? '编辑供应商' : '新增供应商'}
          width={700}
          visible={this.state.visible}
          footer={
            <>
              <Button key='submit' type='primary' onClick={this.handleOk}>
                {isEdit ? '保存' : '新增'}
              </Button>
              <Button key='back' onClick={this.handleCancel}>
                返回
              </Button>
            </>
          }
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <h4>基本信息</h4>
            <FormItem label='供应商分类'>
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
                    value = e
                  } else {
                    const { target } = e
                    value = target.type === 'checkbox' ? target.checked : target.value
                  }
                  this.setState({
                    saleAreaVisible: +value === 5
                  })
                  return value
                }
              })(
                <SupplierTypeSelect
                  disabled={this.props.isEdit}
                  onChange={(value) => {
                    console.log(value, 'value')
                    this.setState({
                      category: value
                    })
                  }}
                />
              )}
            </FormItem>
            <If visible={[0, 1, 3, 4].indexOf(category) === -1} condition={[0, 1, 3, 4].indexOf(category) !== -1}>
              <FormItem label='前台展示'>
                {getFieldDecorator('showType', {
                  initialValue: 0
                })(
                  <Radio.Group>
                    <Radio value={0}>关闭</Radio>
                    <Radio value={1}>开启</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </If>
            <FormItem label='供应商名称'>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入供应商名称'
                }]
              })(<Input placeholder='请输入供应商名称' />)}
            </FormItem>
            <FormItem label='联系电话'>
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入联系电话'
                }]
              })(<Input placeholder='请输入联系电话' maxLength={11} />)}
            </FormItem>
            <FormItem label='供应商简称'>
              {getFieldDecorator('shortName', {
                rules: [
                  {
                    required: showType,
                    message: '请输入供应商简称'
                  },
                  {
                    max: 15,
                    message: '最多15个字符'
                  },
                  {
                    pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/g,
                    message: '仅支持中文、英文、数字'
                  }
                ]
              })(
                <Input placeholder='请输入供应商简称' />,
              )}
            </FormItem>
            <FormItem label='联系人'>
              {getFieldDecorator('contacts')(
                <Input placeholder='请输入联系人' />,
              )}
            </FormItem>
            <FormItem label='联系邮箱'>
              {getFieldDecorator('email')(<Input placeholder='请输入联系邮箱' />)}
            </FormItem>
            <If condition={[0, 1, 2, 3, 4].includes(category)}>
              <h4>店铺信息</h4>
              <FormItem label='店铺名称'>
                {getFieldDecorator('shopName', {
                  rules: [
                    {
                      required: [0, 1, 2, 3, 4].includes(category),
                      message: '请输入店铺名称'
                    }
                  ]
                })(
                  <Input maxLength={10} placeholder='请输入店铺名称' />
                )}
              </FormItem>
              <FormItem label='店铺logo'>
                {getFieldDecorator('shopUrl', {
                  rules: [
                    {
                      required: [0, 1, 2, 3, 4].includes(category),
                      message: '请上传店铺logo'
                    }
                  ]
                })(
                  <UploadView
                    placeholder='上传店铺logo'
                    listType='picture-card'
                    listNum={1}
                    size={2}
                    ossType='cos'
                  />
                )}
              </FormItem>
            </If>
            <h4>详细信息</h4>
            <FormItem label='官网链接'>
              {getFieldDecorator('jumpUrl')(
                <Input placeholder='请输入官网链接' />,
              )}
            </FormItem>
            <FormItem label='详细地址'>
              {getFieldDecorator('address')(
                <Input placeholder='请输入详细地址' />,
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
            {this.state.category === 5 && (
              <FormItem label='设置冻结金额'>
                {getFieldDecorator('frozenMoney', {
                })(
                  <Select
                    placeholder='请选择冻结金额'
                  >
                    <Select.Option value={0}>0元</Select.Option>
                    <Select.Option value={1000}>1000元</Select.Option>
                    <Select.Option value={2000}>2000元</Select.Option>
                    <Select.Option value={3000}>3000元</Select.Option>
                    <Select.Option value={5000}>5000元</Select.Option>
                    <Select.Option value={8000}>8000元</Select.Option>
                    <Select.Option value={10000}>10000元</Select.Option>
                  </Select>
                )}
              </FormItem>
            )}
          </Form>
        </Modal>
      </>
    )
  }
}

export default Form.create()(SupplierModal)
