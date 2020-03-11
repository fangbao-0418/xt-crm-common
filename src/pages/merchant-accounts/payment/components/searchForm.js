import React from 'react';
import moment from 'moment';
import { setQuery } from '@/util/utils';
import { Card, Form, Input, Button, DatePicker, Row, Col, Select } from 'antd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class SearchForm extends React.Component {
  // 查询
  handleSearch = () => {
    const { form: { validateFields }, onFetchData } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        const params = {
          ...vals,
          startCreateTime: vals.createTime && vals.createTime[0] && +new Date(vals.createTime[0]),
          endCreateTime: vals.createTime && vals.createTime[1] && +new Date(vals.createTime[1]),
          startModifyTime: vals.modifyTime && vals.modifyTime[0] && +new Date(vals.modifyTime[0]),
          endModifyTime: vals.modifyTime && vals.modifyTime[1] && +new Date(vals.modifyTime[1]),
          page: 1
        };
        delete params.createTime;
        delete params.modifyTime;
        onFetchData(params);
      }
    });
  };

  // 重置条件
  handleReset = () => {
    const { form: { setFieldsValue }, onFetchData, page } = this.props;
    setFieldsValue({
      settlementSerialNo: '',
      createName: '',
      createTime: '',
      paymentSerialNo: '',
      modifyName: '',
      modifyTime: '',
      storeName: ''
    })
    setQuery({ page: 1, pageSize: page.pageSize }, true);
    onFetchData();
  };

  setFieldsValue = (vals) => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue(vals)
  }

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Card title="筛选">
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Row gutter={24}>
            <Col span={6}>
              <FormItem label="结算单ID">
                {getFieldDecorator('settlementSerialNo', { initialValue: '' })(
                  <Input placeholder="请输入结算单ID" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="结算人名称">
                {getFieldDecorator('storeName', { initialValue: '' })(
                  <Input placeholder="请输入供应商名称" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="创建人">
                {getFieldDecorator('createName', { initialValue: '' })(
                  <Input placeholder="请输入创建人" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="结算人类型">
                {getFieldDecorator('storeNameType', { initialValue: '' })(
                  <Select>
                    <Option value="">全部</Option>
                    <Option value="1">小店</Option>
                    <Option value="2">供应商</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="付款单ID">
                {getFieldDecorator('paymentSerialNo', { initialValue: '' })(
                  <Input placeholder="请输入付款单ID" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="操作人">
                {getFieldDecorator('modifyName', { initialValue: '' })(
                  <Input placeholder="请输入操作人" />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="创建时间">
                {getFieldDecorator('createTime', { initialValue: '' })(
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="操作时间">
                {getFieldDecorator('modifyTime', { initialValue: '' })(
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleSearch}>查询</Button>
              <Button type="default" onClick={this.handleReset}>清除</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(SearchForm);