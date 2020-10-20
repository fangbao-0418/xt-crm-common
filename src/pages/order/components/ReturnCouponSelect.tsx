import React from 'react';
import { Radio } from 'antd';
import { formatPrice } from '@/util/format';

/**
 * 是否回收优惠券金额
 */
interface Props {
  orderServerVO: AfterSalesInfo.OrderServerVO;
  [key: string]: any
}
const ReturnCouponSelect: React.FC<Props> = ({ orderServerVO, ...rest }: Props) => (
  <Radio.Group {...rest}>
    <Radio value={1}>是</Radio>（优惠券金额：￥{formatPrice(orderServerVO.deductionAmount)}）
    <Radio value={0}>否</Radio>
  </Radio.Group>
);
export default ReturnCouponSelect;
