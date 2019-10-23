import React from 'react';
import { Row, Button } from 'antd';
import { storeType, supplierOperate, enumSupplierOperate } from '../../constant';
interface Props {
  data: AfterSalesInfo.data;
}
type OrderServerVO = AfterSalesInfo.OrderServerVO;
const SupplierProcessInfo: React.FC<Props> = ({ data }: Props) => {
  let orderServerVO: OrderServerVO = data.orderServerVO || {};
  return (
    <div>
      <h4>供应商处理信息</h4>
      <Row>供应商名称：{orderServerVO.storeName}</Row>
      <Row>供应商类型：{storeType[orderServerVO.storeType]}</Row>
      <Row>供应商收货状态：{supplierOperate[orderServerVO.supplierOperate]}</Row>
      {orderServerVO.supplierOperate === enumSupplierOperate.ACCEPTED && (
        <>
          <Row>收货数目：{orderServerVO.serverNum}</Row>
          <Row>说明：{orderServerVO.supplierInfo}</Row>
        </>
      )}
    </div>
  );
};

export default SupplierProcessInfo;