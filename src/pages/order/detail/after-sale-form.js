import React, { Component } from 'react';
import { Table, Form, Input, Select, InputNumber, Card } from 'antd';
import { goodsTableColumn } from "../constant";
import refundType from '@/enum/refundType';
import { formatPrice } from '@/util/format';
import PicturesWall from '../components/pictures-wall';
const { Option } = Select;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const onChange = () => { }
class AfterSaleForm extends Component {
  render() {
    const { modalInfo } = this.props;
    const price = formatPrice(modalInfo.buyPrice)
    console.log('modalInfo =>', modalInfo);
    return (
      <>
        <Table dataSource={[modalInfo]} columns={goodsTableColumn} pagination={false}></Table>
        <Card bordered={false} bodyStyle={{paddingBottom: 0}}>
          <Form {...formItemLayout}>
            <Form.Item label="售后类型">
              <Select placeholder="请选择">
                {refundType.getArray().map(v => <Option key={v.key} value={v.key}>{v.val}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="售后原因">
              <Input placeholder="请输入售后原因" />
            </Form.Item>
            <Form.Item label="退款金额">
              <InputNumber min={0} max={price} defaultValue={price} onChange={onChange} />
              <span>最多可退（{price}）</span>
            </Form.Item>
            <Form.Item label="售后凭证">
              <PicturesWall />
            </Form.Item>
            <Form.Item label="售后说明">
              <TextArea></TextArea>
            </Form.Item>
          </Form>
        </Card>
      </>
    )
  }
}
export default Form.create({ name: 'after_sale_form' })(AfterSaleForm);