import React, {useState} from 'react';
import { Row, Col, Button } from 'antd';
import { enumRefundStatus } from '../../constant';
import RemarkModal from '../../components/modal/remark-modal';
import ProcessResultModal from '../../components/modal/ProcessResult';
interface props extends React.Props<{}> {
  orderServerVO: AfterSalesInfo.OrderServerVO;
  orderInfoVO: AfterSalesInfo.OrderInfoVO;
  getDetail: () => void;
  refundId: number;
}
type Dispatch<A> = (value: A) => void;
type SetStateAction<S> = S | ((prevState: S) => S);

const AfterSaleDetailTitle: React.FC<props> = (props) => {
  const { refundId, orderServerVO, orderInfoVO, getDetail } = props;
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] = useState<boolean>(false);
  const isRefundStatusOf = (status: number): boolean => {
    return orderServerVO.refundStatus == status;
  }
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
          {isRefundStatusOf(enumRefundStatus.WaitConfirm) && (
            <RemarkModal
              onSuccess={getDetail}
              orderCode={orderInfoVO.mainOrderCode}
              refundId={refundId}
              childOrderId={orderInfoVO.childOrderId}
            />
          )}
          {isRefundStatusOf(enumRefundStatus.Operating) && <Button type="primary">上传物流信息</Button>}
          {isRefundStatusOf(enumRefundStatus.OperatingOfGoods)
            && <Button type="primary" onClick={() => setVisible(true)}>处理结果</Button>}
        </Col>
      </Row>
    </>
  )
}
export default AfterSaleDetailTitle;