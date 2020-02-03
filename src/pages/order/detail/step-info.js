import React from 'react';
import { Steps, Card } from 'antd';
import { enumOrderStatus } from '../constant';
import { formatDate } from '../../helper';
const { Step } = Steps;

function getCurrentIndex(orderStatus, orderType) {
  // orderType为90等于拼团订单
  const orderStatusMap = orderType !== 90 ? {
    [enumOrderStatus.Unpaid]: 0,
    [enumOrderStatus.Undelivered]: 1,
    [enumOrderStatus.PartDelivered]: 2,
    [enumOrderStatus.Delivered]: 2,
    [enumOrderStatus.Received]: 3,
    [enumOrderStatus.Complete]: 4
  } : {
    [enumOrderStatus.Unpaid]: 0,
    [enumOrderStatus.Undelivered]: 1,
    [enumOrderStatus.Tofight]: 2,
    [enumOrderStatus.PartDelivered]: 3,
    [enumOrderStatus.Delivered]: 3,
    [enumOrderStatus.Received]: 4,
    [enumOrderStatus.Complete]: 5
  }
  return orderStatusMap[orderStatus]
}

function getStatusTime(orderStatusLogList = [], orderStatus) {
  const found =
    orderStatusLogList && orderStatusLogList.find(item => item.orderStatus === orderStatus);

  return found ? formatDate(found.createTime) : '';
}

const StepInfo = ({ orderType, orderStatus, orderStatusLogList = [] }) => {
  if (orderStatus === enumOrderStatus.Closed) {
    return null;
  }
  const current = getCurrentIndex(orderStatus, orderType);

  return (
    <Card>
      <Steps progressDot current={current}>
        <Step
          title="买家下单"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Unpaid)}
        />
        <Step
          title="买家付款"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Undelivered)}
        />
        <Step
          title='待成团'
        />
        <Step
          title="发货"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Delivered)}
        />
        <Step
          title="确认收货"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Received)}
        />
        <Step
          title="交易完成"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Complete)}
        />
      </Steps>
    </Card>
  );
};

export default StepInfo;
