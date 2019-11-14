import React, { useState, useEffect } from 'react';
import ClipboardJS from 'clipboard';
import { Row, Button } from 'antd';
import { ModifyLogisticsInfo } from '../../components/modal';
import { enumRefundStatus } from '../../constant';
import { getExpressCode } from '@/util/utils';
interface Props {
  data: AfterSalesInfo.data;
}
type CheckVO = AfterSalesInfo.CheckVO;
type OrderServerVO = AfterSalesInfo.OrderServerVO;
const LogisticsShippingInfo: React.FC<Props> = ({ data }: Props) => {
  const [visible, setVisible]: useStateType<boolean> = useState<boolean>(false);
  let checkVO: CheckVO = Object.assign({}, data.checkVO);
  let orderServerVO: OrderServerVO = Object.assign({}, data.orderServerVO);
  useEffect(() => {
    new ClipboardJS('#copy-btn');
  }, []);
  return (
    (checkVO.sendExpressName || checkVO.sendExpressCode) ? <>
      <ModifyLogisticsInfo
        title="物流信息修改"
        visible={visible}
        type="platform"
        expressName={getExpressCode(checkVO.sendExpressName)}
        expressCode={checkVO.sendExpressCode}
        onCancel={() => setVisible(false)}
        sendExpressId={checkVO.sendExpressId}
      />
      <div>
        <h4>平台发货物流信息</h4>
        <Row>
          <span>物流公司：{checkVO.sendExpressName}</span>
          <span className="ml20">
            物流单号：<span id="copy-shiptext">{checkVO.sendExpressCode}</span>
          </span>
          {orderServerVO.refundStatus === enumRefundStatus.WaitUserReceipt  && (
            <>
              <Button
                id="copy-btn"
                type="primary"
                className="ml20"
                data-clipboard-target="#copy-shiptext"
              >
                复制
              </Button>
              <Button type="primary" className="ml10" onClick={() => setVisible(true)}>
                修改
              </Button>
            </>
          )}
        </Row>
      </div>
    </>: null
  );
};

export default LogisticsShippingInfo;
