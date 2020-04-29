/*
 * @Author: fangbao
 * @Date: 2020-01-19 15:41:45
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-30 01:00:34
 * @FilePath: /eslint-plugin-xt-react/Users/fb/Documents/xituan/xt-crm/src/components/good-cell/index.js
 */
import React from 'react';
import './index.scss';

const replaceHttpUrl = (imgUrl = '') => {
  // if (imgUrl.indexOf('http') !== 0) {
  //   imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  // }
  // return imgUrl;
  return APP.fn.fillOssDomainUrl(imgUrl)
}

const GoodCell = (props) => {
  const { productImage, skuName, properties, coverUrl, showImage = true, orderType, refundType, isRefund } = props
  const isGive = isRefund ? false : String(orderType) === '50'
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
