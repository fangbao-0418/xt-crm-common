import React, { useState, useEffect } from 'react';
import ClipboardJS from "clipboard";
import { Row, Card, Button } from 'antd';
import ModifyLogisticsInfo from '../../components/modal/ModifyLogisticsInfo';
interface Props {
  data: AfterSalesInfo.data;
}
type CheckVO = AfterSalesInfo.CheckVO;
const LogisticsInformation: React.FC<Props> = ({ data }: Props) => {
  const [visible, setVisible]: useStateType = useState<boolean>(false);
  let checkVO: CheckVO = data.checkVO || {};
  useEffect(() => {
    new ClipboardJS('#copy-btn');
  }, []);
  return (
    <>
      <ModifyLogisticsInfo
        checkVO={checkVO}
        title="物流信息修改"
        visible={visible}
        returnExpressName={checkVO.returnExpressName}
        returnExpressCode={checkVO.returnExpressCode}
        onCancel={() => setVisible(false)}
      />
      <div>
        <h4>用户发货物流信息</h4>
        <Row>
          <span>物流公司：{checkVO.returnExpressName}</span>
          <span className="ml20">
            物流单号：<span id="copy-text">{checkVO.returnExpressCode}</span>
          </span>
          <Button id="copy-btn" type="primary" className="ml20" data-clipboard-target="#copy-text">
            复制
          </Button>
          <Button type="primary" className="ml10" onClick={() => setVisible(true)}>
            修改
          </Button>
        </Row>
      </div>
    </>
  );
};

export default LogisticsInformation;
