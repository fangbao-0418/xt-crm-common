import React, {useState} from 'react';
import { Row, Col, Button } from 'antd';
import { enumRefundStatus } from '../../constant';
import RemarkModal from '../../components/modal/remark-modal';
import ProcessResultModal from '../../components/modal/ProcessResultModal';
interface props extends React.Props<{}> {
  orderServerVO: AfterSalesInfo.OrderServerVO;
  orderInfoVO: AfterSalesInfo.OrderInfoVO;
  refundStatus: number;
  getDetail: () => void;
  refundId: number;
}
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);
const AfterSaleDetailTitle: React.FC<props> = (props) => {
  const { refundId, orderServerVO, refundStatus, orderInfoVO, getDetail } = props;
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(false);
  return (
    <>
      <ProcessResultModal visible={visible} handleCancel={() => setVisible(false)} />
      <Row type="flex" justify="space-between" align="middle" className="mb10">
        <Col>
          <h3>
            <span>售后单编号：{orderServerVO.orderCode}</span>
            <span className="ml20">售后状态：{orderServerVO.refundStatusStr}</span>
          </h3>
        </Col>
        <Col>
          {enumRefundStatus.WaitConfirm == refundStatus && (
            <RemarkModal
              onSuccess={getDetail}
              orderCode={orderInfoVO.mainOrderCode}
              refundId={refundId}
              childOrderId={orderInfoVO.childOrderId}
            />
          )}
          {
            enumRefundStatus.Operating == refundStatus && <Button type="primary" onClick={() => setVisible(true)}>处理结果</Button>
          }
        </Col>
      </Row>
    </>
  )
}
export default AfterSaleDetailTitle;