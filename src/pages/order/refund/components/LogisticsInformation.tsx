import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Row, Card, Button } from 'antd';
import { namespace } from '../model';
import ModifyLogisticsInfo from '../../components/modal/ModifyLogisticsInfo';
interface Props {
  data: AfterSalesInfo.data;
}
type CheckVO = AfterSalesInfo.CheckVO;
const LogisticsInformation: React.FC<Props> = ({ data }: Props) => {
  const [visible, setVisible]: useStateType = useState<boolean>(false);
  let checkVO: CheckVO = data.checkVO || {};
  return (
    <>
      <ModifyLogisticsInfo
        checkVO={checkVO}
        title="物流信息修改"
        visible={visible}
        onCancel={() => setVisible(false)}
      />
      <Card title="用户发货物流信息">
        <Row>
          <span>物流公司：{checkVO.returnExpressName}</span>
          <span className="ml20">物流单号：{checkVO.returnExpressCode}</span>
          <Button type="primary" className="ml20">
            复制
          </Button>
          <Button type="primary" className="ml10" onClick={() => setVisible(true)}>
            修改
          </Button>
        </Row>
      </Card>
    </>
  );
};

export default connect((state: any) => {
  return {
    data: state[namespace].data || {},
  };
})(LogisticsInformation);
