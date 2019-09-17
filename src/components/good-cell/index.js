import React from 'react';
import './index.scss';

const replaceHttpUrl = (imgUrl = '') => {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

const GoodCell = ({ productImage, skuName, properties, coverUrl }) => {
  return (
    <div className="good-cell">
      <div className="good-image">
        <img alt={'商品图片'} src={replaceHttpUrl(coverUrl || productImage)} style={{ maxHeight: 100, maxWidth: 100 }} />
      </div>
      <div className="good-title">
        {skuName} {properties ? `(${properties})` : ''}
      </div>
    </div>
  );
};

export default GoodCell;
