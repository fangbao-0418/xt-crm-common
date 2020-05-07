/*
 * @Author: fangbao
 * @Date: 2020-01-19 15:41:45
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-30 01:05:55
 * @FilePath: /eslint-plugin-xt-react/Users/fb/Documents/xituan/xt-crm/src/pages/order/components/refund-cell/index.js
 */
import React from 'react';
import './index.scss';
import { TextMapRefundType } from '../../constant';
import Image from '../../../../components/Image';

const replaceHttpUrl = imgUrl => {
  // if (imgUrl.indexOf('http') !== 0) {
  //   imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  // }
  // return imgUrl;
  return APP.fn.fillOssDomainUrl(imgUrl)
}

const RefundCell = ({ refundType, info, describe, imgUrl = '' }) => {
  let imgList = [];
  if (imgUrl) {
    imgList = imgUrl.split(','); //NOTE: 2019年06月15日20:02:52 喜团这边从JSON改成 ‘url,url’ 以逗号为分割的
    // 订单号 15605911330022089690
  }

  return (
    <div className="refund-cell">
      <div>
        <div>买家售后类型:{TextMapRefundType[refundType]}</div>
        <div>买家申请售后原因:{info}</div>
        <div>详细描述：{describe}</div>
      </div>
      <div className="refund-img-wrapper">
        {imgList && imgList.map(url => <Image alt="售后图片" src={replaceHttpUrl(url)} key={url} />)}
      </div>
    </div>
  );
};

export default RefundCell;
