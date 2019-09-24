import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;

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

export const ExpressCompanyOptions = {
  ems: 'EMS',
  shunfeng: '顺丰',
  shentong: '申通',
  yuantong: '圆通',
  zhongtong: '中通',
  huitongkuaidi: '汇通',
  yunda: '韵达',
  guotongkuaidi: '国通',
  debangwuliu: '德邦',
  jd: '京东',
  tiantian: '天天快递',
  youzhengbk: "邮政标准快递",
  youzhengguonei: "邮政快递包裹"
};

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
