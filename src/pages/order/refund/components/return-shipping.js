import React from 'react';
import { Radio } from 'antd';
import { formatPrice } from '@/util/format';

/**
 * 返回是否支付运费组件
 * @param {*} checkVO 
 */
const returnShipping = checkVO => (
  <Radio.Group>
    <Radio value={1}>是</Radio>（运费金额：￥{formatPrice(checkVO.freight)}）
    <Radio value={0}>否</Radio>
  </Radio.Group>
)
export default returnShipping;