import React from 'react';
import { Steps, Card } from 'antd';
import { enumOrderStatus } from '../constant';
import { formatDate } from '../../helper';
const { Step } = Steps;

function getCurrentIndex(orderStatus) {
  switch (orderStatus) {
    case enumOrderStatus.Unpaid:
      return 0;
    case enumOrderStatus.Undelivered:
      return 1;
    case enumOrderStatus.Delivered:
      return 2;
    case enumOrderStatus.Received:
      return 3;
    case enumOrderStatus.Complete:
      return 4;
    default:
      break;
  }
}

function getStatusTime(orderStatusLogList = [], orderStatus) {
  const found =
    orderStatusLogList && orderStatusLogList.find(item => item.orderStatus === orderStatus);

  return found ? formatDate(found.createTime) : '';
}

const StepInfo = ({ orderStatus, orderStatusLogList = [] }) => {
  if (orderStatus === enumOrderStatus.Closed) {
    return null;
  }
  const current = getCurrentIndex(orderStatus);

  return (
    <Card>
      <Steps progressDot current={current}>
        <Step
          title="1.买家下单"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Unpaid)}
        />
        <Step
          title="2.买家付款"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Undelivered)}
        />
        <Step
          title="3.发货"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Delivered)}
        />
        <Step
          title="4.确认收货"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Received)}
        />
        <Step
          title="5.交易完成"
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Complete)}
        />
      </Steps>
    </Card>
  );
};

export default StepInfo;
