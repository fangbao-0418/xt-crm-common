import React from 'react';
import { Steps, Card } from 'antd';
// import { enumOrderStatus } from '../constant';
// import { formatDate } from '../../helper';
const { Step } = Steps;


const StepInfo = ({ stepinfo = [] }) => {
  const current = 0;
  return (
    <Card>
      <Steps progressDot current={current}>
        {
          stepinfo.map((o, index) => <Step
            key={index}
            title={o.operateTypeInfo}
            description={<div>
              <div>{index === 0 ? '创建时间' : '操作时间'}：{APP.fn.formatDate(o.operateTime)}</div>
              <div>{index === 0 ? '创建人' : '操作人'}：{o.operateName}</div>
            </div>}
          />)
        }

      </Steps>
    </Card>
  );
};

export default StepInfo;
