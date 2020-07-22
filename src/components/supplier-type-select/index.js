import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

// EMS("ems", "EMS"),
// SHUNFENG("shunfeng", "顺丰"),
// SHENTONG("shentong", "申通"),
// YUANTONG("yuantong", "圆通"),
// ZHONGTONG("zhongtong", "中通"),
// HUITONGKUAIDI("huitongkuaidi", "汇通"),
// YUNDA("yunda", "韵达"),
// GUOTONGKUAIDI("guotongkuaidi", "国通"),
// DEBANGWULIU("debangwuliu", "德邦"),
// JD("jd", "京东"),

const Options = {
  0: '喜团',
  1: '1688',
  2: '淘宝联盟',
  3: '一般海外供应商',
  4: '保税仓海外供应商',
  5: '喜团买菜供应商',
  6: '小店供应商',
  7: 'pop店'
}

const valueArray = Object.keys(Options)

export default class SupplierTypeSelect extends Component {
  render () {
    return (
      <Select
        allowClear
        placeholder='请选择供应商分类'
        style={{ width: 150 }}
        {...this.props}
      >
        {valueArray.map(v => (
          <Option value={Number(v)} key={v}>{Options[v]}</Option>
        ))}
      </Select>
    )
  }
}
