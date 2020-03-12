import React from 'react';
import { Steps, Card } from 'antd';
import { enumOrderStatus } from '../constant';
import { formatDate } from '@/pages/helper';
const { Step } = Steps;

function getCurrentIndex(orderStatus, orderType) {
  const orderStatusMap = {
    [enumOrderStatus.Unpaid]: 0,
    [enumOrderStatus.Undelivered]: 1,
    [enumOrderStatus.Delivered]: 3,
    [enumOrderStatus.Complete]: 4
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
          title='买家下单'
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Unpaid)}
        />
        <Step
          title='待发货'
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Undelivered)}
        />
        <Step
          title='待提货'
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Delivered)}
        />
        <Step
          title='已提货'
          description={getStatusTime(orderStatusLogList, enumOrderStatus.Complete)}
        />
      </Steps>
    </Card>
  );
};

export default StepInfo;
