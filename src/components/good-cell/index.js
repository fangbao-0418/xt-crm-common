import React from 'react';
import './index.scss';

const replaceHttpUrl = (imgUrl = '') => {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

const GoodCell = ({ productImage, skuName, properties, coverUrl, orderType, refundType, isRefund }) => {
  const isGive = isRefund ? String(refundType) === '50' : String(orderType) === '50'
  return (
    <div className="good-cell">
      <div className="good-image">
        <img alt={'商品图片'} src={replaceHttpUrl(coverUrl || productImage)} style={{ maxHeight: 100, maxWidth: 100 }} />
      </div>
      <div className="good-title">
        {isGive && <span style={{border: '1px solid red', fontSize: 12, color: 'red', padding: '0 2px', margin: '0 2px'}}>赠</span>}
        {skuName} {properties ? `(${properties})` : ''}
      </div>
    </div>
  );
};

export default GoodCell;
