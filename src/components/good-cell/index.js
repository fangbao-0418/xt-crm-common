import React from 'react';
import './index.scss';

const replaceHttpUrl = (imgUrl = '') => {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

const GoodCell = (props) => {
  const { productImage, skuName, properties, coverUrl, showImage = true } = props
  return (
    <div>
      {
        showImage && <div style={{ float: 'left' }}>
          <img alt={'商品图片'} src={replaceHttpUrl(coverUrl || productImage)} style={{ maxHeight: 100, maxWidth: 100 }} />
        </div>
      }
      <div style={showImage?{ marginLeft:116}:{marginLeft:0,textAlign:'left'}}>
        <div>{skuName}</div>
        <div style={{ marginTop: 8 }}>{properties ? `${properties}` : ''}</div>
      </div>
    </div>
  );
};

export default GoodCell;
