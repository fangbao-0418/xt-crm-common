import React from 'react';
import { Row } from 'antd';

enum operates {
  已收货 = 10,
  已发货 = 20,
  完成 = 30,
  拒绝 = 60
}

interface Props {
  data: AfterSalesInfo.data;
}

const SelfOwnedWarehouse: React.FC<Props> = ({ data }) => (
  <section>
    <h4>自营仓处理信息</h4>
    <Row>自营仓名称：{data.warehouseName}</Row>
    <Row>供应商名称：{data.storeName}</Row>
    <Row>自营仓收货状态：{operates[data.warehouseOperate]}</Row>
  </section>
)

export default SelfOwnedWarehouse;