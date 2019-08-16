import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { map } from 'lodash';
import DeliveryModal from './components/delivery-modal';

const ExpressCompanyOptions = {
  ems: 'EMS',
  shunfeng: '顺丰',
  shentong: '申通',
  yuantong: '圆通',
  zhongtong: '中通',
  huitongkuaidi: '汇通',
  yunda: '韵达',
  guotongkuaidi: '国通',
  debangwuliu: '德邦',
  jd: '京东',
  tiantian: '天天快递',
  youzhengbk: "邮政标准快递",
  youzhengguonei: "邮政快递包裹"
};

const LogisticsInfo = ({ logistics = {}, orderInfo = {}, onSuccess, mainorderInfo }) => {
  return (
    Array.isArray(logistics.orderPackageList) && logistics.orderPackageList.length > 0 ? <Card>
      <Row gutter={24}>
        <Col className="gutter-row" span={24}>
          <div className="gutter-box">物流信息</div>
        </Col>
      </Row>
      {map(logistics.orderPackageList, (data, index) => (
        <Row gutter={24} key={index}>
          <Col className="gutter-row" span={9}>
            <div className="gutter-box">
              物流公司：{ExpressCompanyOptions[data.expressCompanyName]}
            </div>
          </Col>
          <Col className="gutter-row" span={9}>
            <div className="gutter-box">快递单号：{data.expressCode}</div>
          </Col>
          <Col span={6}>
            <Button
              type="link"
              target="_blank"
              href={`http://cha.chawuliu.cn/?stype=kd&q=${data.expressCode || ''}`}
            >
              查询物流信息
            </Button>
            <DeliveryModal mainorderInfo={mainorderInfo} title="修改物流信息" onSuccess={onSuccess} data={data} />
          </Col>
        </Row>
      ))}
    </Card>: null
  );
};

export default LogisticsInfo;
