import React from 'react';
import { Select } from 'antd';
import { enumRefundType, TextMapRefundType } from '../../constant';
const { Option } = Select;

const valueArr = Object.values(enumRefundType);
const RefundTypeSelect = props => {
  return (
    <Select {...props}>
      {valueArr.map(value => (
        <Option key={value} value={value}>{TextMapRefundType[value]}</Option>
      ))}
    </Select>
  );
};

export default RefundTypeSelect;
