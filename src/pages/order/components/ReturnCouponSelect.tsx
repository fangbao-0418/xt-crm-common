import React from 'react';
import { Radio } from 'antd';
import { formatPrice } from '@/util/format';

/**
 * 是否回收优惠券金额
 */
interface Props {
  checkVO: AfterSalesInfo.CheckVO;
}
const ReturnCouponSelect: React.FC<Props> = ({ checkVO, ...rest }: Props) => (
  <Radio.Group {...rest}>
    <Radio value={1}>是</Radio>（优惠券金额：￥{formatPrice(checkVO.freight)}）
    <Radio value={0}>否</Radio>
  </Radio.Group>
);
export default ReturnCouponSelect;
