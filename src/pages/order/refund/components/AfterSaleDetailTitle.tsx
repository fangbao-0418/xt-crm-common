import React, {useState} from 'react';
import { Row, Col, Button } from 'antd';
import { enumRefundStatus } from '../../constant';
import {RemarkModal, ModifyLogisticsInfo, ProcessResult} from '../../components/modal';
interface props extends React.Props<{}> {
  orderServerVO: AfterSalesInfo.OrderServerVO;
  orderInfoVO: AfterSalesInfo.OrderInfoVO;
  checkVO: AfterSalesInfo.CheckVO;
  getDetail: () => void;
  refundId: number;
}

const AfterSaleDetailTitle: React.FC<props> = (props) => {
  const { refundId, orderServerVO, orderInfoVO, checkVO, getDetail } = props;
  const [processResultVisible, setProcessResultVisible]: useStateType = useState<boolean>(false);
  const [logisticsInfoVisible, setLogisticsInfoVisible]: useStateType = useState<boolean>(false);

  const isRefundStatusOf = (status: number): boolean => {
    return orderServerVO.refundStatus == status;
  }
  return (
    <>
      <ModifyLogisticsInfo
        title="物流信息上传"
        visible={logisticsInfoVisible}
        onCancel={() => setLogisticsInfoVisible(false)}
        checkVO={checkVO}/>
      <ProcessResult visible={processResultVisible} handleCancel={() => setProcessResultVisible(false)} />
      <Row type="flex" justify="space-between" align="middle" className="mb10">
        <Col>
          <h3>
            <span>售后单编号：{orderServerVO.orderCode}</span>
            <span className="ml20">售后状态：{orderServerVO.refundStatusStr}</span>
          </h3>
        </Col>
        <Col>
          {isRefundStatusOf(enumRefundStatus.WaitConfirm) && (
            <RemarkModal
              onSuccess={getDetail}
              orderCode={orderInfoVO.mainOrderCode}
              refundId={refundId}
              childOrderId={orderInfoVO.childOrderId}
            />
          )}
          {isRefundStatusOf(enumRefundStatus.Operating) && <Button type="primary" onClick={() => setLogisticsInfoVisible(true)}>上传物流信息</Button>}
          {isRefundStatusOf(enumRefundStatus.OperatingOfGoods)
            && <Button type="primary" onClick={() => setProcessResultVisible(true)}>处理结果</Button>}
        </Col>
      </Row>
    </>
  )
}
export default AfterSaleDetailTitle;