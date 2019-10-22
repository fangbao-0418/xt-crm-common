import React from 'react';
import { Row, Col, Button, Divider } from 'antd';
import { map } from 'lodash';
import DeliveryModal from './components/delivery-modal';
import { formatDate } from '@/pages/helper';
import { ExpressCompanyOptions } from '@/config';

const LogisticsInfo = ({ logistics = {}, orderInfo = {}, onSuccess, mainorderInfo }) => {
  return (
    Array.isArray(logistics.orderPackageList) && logistics.orderPackageList.length > 0 ?
      <div>
        <Divider />
        <Row gutter={24}>
          <Col className="gutter-row" span={24}>
            <div className="gutter-box" style={{ fontWeight: 'bold' }}>物流信息</div>
          </Col>
        </Row>
        {map(logistics.orderPackageList, (data, index) => (
          <Row gutter={24} key={index}>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">
                物流公司：{ExpressCompanyOptions[data.expressCompanyName]}
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">快递单号：{data.expressCode}</div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="gutter-box">物流时间：{formatDate(data.createTime)}</div>
            </Col>
            <Col span={6} style={{textAlign:'right'}}>
              <Button
                target="_blank"
                href={`http://cha.chawuliu.cn/?stype=kd&q=${data.expressCode || ''}`}
                style={{ marginRight: 8 }}
              >
                查询物流信息
              </Button>
              <DeliveryModal mainorderInfo={mainorderInfo} title="修改物流信息" onSuccess={onSuccess} data={data} />
            </Col>
          </Row>
        ))}
      </div> :
      null
  );
};

export default LogisticsInfo;
