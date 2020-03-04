import React from 'react';
import moment from 'moment';
import { Card, Row, Col } from 'antd';
import { TextMapRefundType } from '../../constant';
import Image from '@/components/Image';
import { dateFormat } from '@/util/utils';


const replaceHttpUrl = imgUrl => {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

const RefundInfo = props => {
  const { data = {} } = props;
  const {
    refundType,
    info,
    describe,
    imgUrl = '',
    orderCode,
    createTime,
    mainOrderCode,  
    orderTime,
    payTime,
    payTypeStr,
    refundStatusStr,
    returnReasonStr,
    refundStatus,
    refundErrorMsg
  } = data;
  let imgList = [];
  if (imgUrl) {
    imgList = imgUrl.split(','); //NOTE: 2019年06月15日20:02:52 喜团这边从JSON改成 ‘url,url’ 以逗号为分割的
    // 订单号 15605911330022089690
  }
  return (
    <Card>
      <Row>
        <Col span={24}>当前状态: {refundStatusStr}  {refundStatus == 21 ? <span style={{ color: 'red' }}>({refundErrorMsg})</span> : ''}</Col>
        <Col span={12}>售后编号: {orderCode}</Col>
        <Col span={12}>申请时间: {createTime ? moment(createTime).format(dateFormat) : ''}</Col>
        <Col span={12}>订单编号: {mainOrderCode}</Col>
        <Col span={12}>下单时间: {orderTime ? moment(orderTime).format(dateFormat) : ''}</Col>
        <Col span={12}>支付方式: {payTypeStr}</Col>
        <Col span={12}>支付时间: {payTime ? moment(payTime).format(dateFormat) : ''}</Col>
        <Col span={24}>售后类型: {TextMapRefundType[refundType]}</Col>
        <Col span={24}>售后原因: {returnReasonStr}</Col>
        <Col span={24}>买家备注:{info}</Col>
        <Col span={24}>
          <div>凭证：</div>
          {imgList
            ? imgList.map(url => (
              <Col className="gutter-row" span={6} key={url}>
                <Image alt="售后图片" src={replaceHttpUrl(url)} key={url} style={{ height: 60 }} />
              </Col>
            ))
            : '暂无售后图片'}
        </Col>
      </Row>
    </Card>
  );
};

export default RefundInfo;
