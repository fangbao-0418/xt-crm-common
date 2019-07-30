import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;

export const levelArr = [
  {
      key: '所有用户',
      value: ''
  }, {
      key: '注册用户',
      value: '0'
  }, {
      key: '团长',
      value: '10'
  }, {
      key: '社区管理员',
      value: '20'
  }, {
      key: '城市合伙人',
      value: '30'
  }, {
      key: '管理员',
      value: '40'
  }
];

export default class extends Component {
  render() {
    return (
      <Select placeholder="请选择等级" style={{ width: 150 }} {...this.props}>
        {levelArr.map((item, index) => (
          <Option value={item.value} key={index}>{item.key}</Option>
        ))}
      </Select>
    );
  }
}