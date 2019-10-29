import React from 'react';
import './index.scss';

const replaceHttpUrl = (imgUrl = '') => {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

// const GoodCell = ({ productImage, skuName, properties, coverUrl, showImage = true, orderType, refundType, isRefund }) => {

    // <div className="good-cell">
    //   {showImage && <div className="good-image">
    //     <img alt={'商品图片'} src={replaceHttpUrl(coverUrl || productImage)} style={{ maxHeight: 100, maxWidth: 100 }} />
    //   </div>}

const GoodCell = ({ productImage, skuName, properties, coverUrl, showImage = true, orderType, refundType, isRefund }) => {
  const isGive = isRefund ? String(refundType) === '50' : String(orderType) === '50'
  return (
    <div>
      {
        showImage && <div style={{ float: 'left' }}>
          <img alt={'商品图片'} src={replaceHttpUrl(coverUrl || productImage)} style={{ maxHeight: 100, maxWidth: 100 }} />
        </div>
      }
      <div style={showImage?{ marginLeft:116}:{marginLeft:0,textAlign:'left'}}>
        <div>
          {isGive && <span style={{border: '1px solid red', fontSize: 12, color: 'red', padding: '0 2px', margin: '0 2px'}}>赠</span>}
          {skuName}
        </div>
        <div style={{ marginTop: 8 }}>{properties ? `${properties}` : ''}</div>
      </div>
    </div>
  );
};

export default GoodCell;
