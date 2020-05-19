/*
 * @Date: 2020-04-09 17:45:36
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 11:26:32
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/components/suppiler-auto-select/index.js
 */
import React, { Component } from 'react'
import { Select } from 'antd'
import { getStoreList, getFreshList, getAllStoreList } from './api'
import { map } from 'lodash'
/**
 * 供应商下拉组件
 * @class
 */
class SuppilerSelect extends Component {
  /**
   * @static
   * @property {('normal'|'fresh'|'all')} [type=normal] - normal-喜团优选 fresh-喜团买菜 all-全部 smallshop-小店
   */
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
    params = {
      pageSize: 5000,
      ...params
    }
    /** 这里可自定已配置传参 */
    if (typeof this.props.processPayload === 'function') {
      params = this.props.processPayload(params) || params
    }
    let api
    const type = this.props.type
    if (type === 'fresh') {
      api = getFreshList(params)
    } else if (type === 'all') {
      api = getAllStoreList(params)
    } else {
      api = getStoreList(params)
    }
    // const api = this.props.type === 'normal' ? getStoreList(params) : getFreshList(params)
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
