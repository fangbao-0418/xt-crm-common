/*
 * @Date: 2020-04-09 17:45:36
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-14 17:04:59
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/components/suppiler-auto-select/index.js
 */
import React, { Component } from 'react'
import { Select } from 'antd'
import { getStoreList, getFreshList } from './api'
import { map } from 'lodash'
class SuppilerSelect extends Component {
  /** type  'normal' | 'fresh' */
  static defaultProps = {
    type: 'normal'
  }
  state = {
    supplier: []
  }
  componentDidMount () {
    this.getStoreList()
  }
  getStoreList = (params) => {
    params = { pageSize: 5000, ...params }
    /** 这里可自定已配置传参 */
    if (typeof this.props.processPayload === 'function') {
      params = this.props.processPayload(params) || params
    }
    const api = this.props.type === 'normal' ? getStoreList(params) : getFreshList(params)
    api.then((res = {}) => {
      this.setState({
        supplier: res.records
      })
    })
  }
  render () {
    const { supplier } = this.state
    return (
      <Select
        allowClear
        value={this.props.value}
        style={this.props.style}
        id={this.props.id}
        onChange={this.props.onChange}
        placeholder='请选择供货商'
        showSearch
        showArrow={false}
        filterOption={(inputValue, option) => {
          return option.props.children.indexOf(inputValue) > -1
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
export default SuppilerSelect
