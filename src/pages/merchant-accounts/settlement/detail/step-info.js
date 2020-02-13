import React from 'react';
import { Steps, Card } from 'antd';
// import { enumOrderStatus } from '../constant';
// import { formatDate } from '../../helper';
const { Step } = Steps;

function getCurrentIndex(status) {
  return 0;

  // switch (status) {
  //   case enumOrderStatus.Unpaid:
  //     return 0;
  //   case enumOrderStatus.Undelivered:
  //     return 1;
  //   case enumOrderStatus.PartDelivered:
  //     return 2;
  //   case enumOrderStatus.Delivered:
  //     return 2;
  //   case enumOrderStatus.Received:
  //     return 3;
  //   case enumOrderStatus.Complete:
  //     return 4;
  //   default:
  //     break;
  // }
}



const StepInfo = ({ stepinfo }) => {

  const current = getCurrentIndex(0);

  return (
    <Card>
      <Steps progressDot current={current}>
        {
          stepinfo.map((o, index) => <Step
            key={index}
            title={o.statusText}
            description={<div>
              <div>{index===0?'创建时间':'操作时间'}：{o.createTime}</div>
              <div>{index===0?'创建人':'操作人'}：{o.createName}</div>
            </div>}
          />)
        }

      </Steps>
    </Card>
  );
};

export default StepInfo;
