import React from 'react';
import { Card, Button } from 'antd';

const LogisticsInformation: React.FC = () => {
  return (
    <Card title="用户发货物流信息">
      物流公司：天天快递 物流单号：30190418131456778899
      <Button type="primary">复制</Button>
      <Button type="primary">修改</Button>
    </Card>
  )
}
export default LogisticsInformation;