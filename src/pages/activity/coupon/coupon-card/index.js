import React from 'react';
import './index.scss';
function CouponCard() {
  return (
    <div className="coupon-card">
      <div className="coupon-card__amount">
        <div class="price-symbol">
          <span className="symbol">¥</span>
          <span className="price">50</span>
        </div>
        <p>满365元可用</p>
      </div>
      <div className="coupon-card__info">
        <div><span class="coupon-rule">排除商品</span>中秋满减优惠排除商品大脸猫个人专用优惠券</div>
        <div className="coupon-date">2019.04.23-2019.05.12</div>
        <div className="coupon-range">仅美妆类商品可用</div>
      </div>
    </div>
  );
}
export default CouponCard;