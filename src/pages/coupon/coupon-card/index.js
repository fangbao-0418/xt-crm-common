import React from 'react';
import { formatUseTime, formatAvlRange } from '@/pages/helper';
import './index.scss';
function CouponCard({ info }) {
  console.log('info=>', info);
  let faceValue = info.ruleVO.faceValue;
  faceValue = faceValue.split(':');
  let msg = '';
  let price = '';
  switch (info.ruleVO.useSill) {
    // 无门槛
    case 0:
      msg = '无门槛';
      price = faceValue[0];
      break;
    // 满减
    case 1:
      msg = `满${faceValue[0]}元可用`;
      price = faceValue[1];
      break;
    default:
      break;
  }
  return (
    <div className="coupon-card">
      <div className="coupon-card__amount">
        <div className="price-symbol">
          <span className="symbol">¥</span>
          <span className="price">{price}</span>
        </div>
        <p>{msg}</p>
      </div>
      <div className="coupon-card__info">
        <div><span className="coupon-rule">{formatAvlRange(info.ruleVO.avlRange)}</span>{info.baseVO.name}</div>
        <div className="coupon-date">{formatUseTime(info.ruleVO)}</div>
        <div className="coupon-range">{info.baseVO.description.slice(0, 12)}</div>
      </div>
    </div>
  );
}
export default CouponCard;