import React, { useState } from 'react';
import { Row, Col, Button, Divider } from 'antd';
import { map } from 'lodash';
import DeliveryModal from './components/delivery-modal';
import { formatDate } from '@/pages/helper';
import { ExpressCompanyOptions } from '@/config';

const LogisticsInfo = ({ logistics = {}, orderInfo = {}, onSuccess, mainorderInfo }) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});

  const showModal = data => {
    setVisible(true);
    setData(data);
  };

  const onOk = () => {
    setVisible(false);
    onSuccess && onSuccess();
  };
  return Array.isArray(logistics.orderPackageList) && logistics.orderPackageList.length > 0 ? (
    <div>
      <Divider />
      <Row gutter={24}>
        <Col className="gutter-row" span={24}>
          <div className="gutter-box" style={{ fontWeight: 'bold' }}>
            物流信息
          </div>
        </Col>
      </Row>
      {map(logistics.orderPackageList, (data, index) => (
        <Row key={index} gutter={24} style={{ marginBottom: 8 }}>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box">物流公司：{ExpressCompanyOptions[data.expressCompanyName]}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box">快递单号：{data.expressCode}</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div className="gutter-box">物流时间：{formatDate(data.createTime)}</div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Button
              target="_blank"
              // href={`http://cha.chawuliu.cn/?stype=kd&q=${data.expressCode || ''}`}
              href={`https://www.kuaidi100.com/chaxun?com=${data.expressCompanyName}&nu=${data.expressCode || ''}`}
              style={{ marginRight: 8 }}
            >
              查询物流信息
            </Button>
            <Button type="primary" onClick={() => showModal(data)}>
              修改物流信息
            </Button>
          </Col>
        </Row>
      ))}
      <DeliveryModal
        visible={visible}
        mainorderInfo={mainorderInfo}
        logistics={orderInfo}
        title="修改物流信息"
        onSuccess={onOk}
        data={data}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  ) : null;
};

export default LogisticsInfo;
