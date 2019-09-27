import React from 'react';
import { Card, Steps } from 'antd';
function Step(props: any) {
  const status = props.isDelete === 1 ? 'error' : props.data.refundStatus === 30 ? 'finish' : props.data.refundStatus === 40 ? 'error' : 'finish'
  const title = props.data.isDelete === 1 ? '关闭' : props.data.refundStatus === 30 ? '完成' : props.data.refundStatus === 40 ? '关闭' : '完成'
  return (
    <Card>
      <Steps current={props.data.current}>
        <Steps.Step title="待审核" />
        <Steps.Step title="处理中" />
        <Steps.Step status={status} title={title} />
      </Steps>
    </Card>
  )
}
export default Step;