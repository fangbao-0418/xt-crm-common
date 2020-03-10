import React, { Component } from 'react';
import { Select } from 'antd';
import { getStoreList, getFreshList } from './api';
import { map } from 'lodash';
class SuppilerSelect extends Component {
  /** type  'normal' | 'fresh' */
  defaultProps = {
    type: 'normal'
  }
  state = {
    supplier: []
  }
  componentDidMount() {
    this.getStoreList();
  }
  getStoreList = (params) => {
    params = { pageSize: 5000, ...params };
    const api = this.props.type === 'normal' ? getStoreList(params): getFreshList(params);
    api.then((res = {}) => {
      this.setState({
        supplier: res.records,
      });
    });
  }
  render() {
    const { supplier } = this.state;
    return (
      <Select
        allowClear
        value={this.props.value}
        style={this.props.style}
        id={this.props.id}
        onChange={this.props.onChange}
        placeholder="请选择供货商"
        showSearch
        showArrow={false}
        filterOption={(inputValue, option) => {
          return option.props.children.indexOf(inputValue) > -1;
        }}
      >
        {map(supplier, item => (
          <Select.Option value={item.id} key={item.id}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
export default SuppilerSelect;
