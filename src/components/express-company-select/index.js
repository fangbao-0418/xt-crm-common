import React, { Component } from 'react';
import { ExpressCompanyOptions } from '@/config'
import { Select } from 'antd';

const { Option } = Select;

const valueArray = Object.keys(ExpressCompanyOptions);

export default class SupplierSelect extends Component {
  render() {
    return (
      <Select placeholder="请选择快递公司" style={{ width: 150 }} {...this.props}>
        {valueArray.map((v, index) => (
          <Option value={v} key={index}>{ExpressCompanyOptions[v]}</Option>
        ))}
      </Select>
    );
  }
}
