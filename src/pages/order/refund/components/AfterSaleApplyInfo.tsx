import React from 'react';
import { Button, Row, Col, Table } from 'antd';
import { createType, refundType } from '@/enum';
import PicturesWall from '../../components/pictures-wall';
import { withRouter, RouteComponentProps } from 'react-router';
import { getDetailColumns } from '../../constant';
import { replaceHttpUrl } from '@/util/utils';
import { formatMoneyWithSign, formatDate } from '@/pages/helper';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';
import { namespace } from '../../refund/model';
import { RemarkModal } from '../../components/modal';
import { enumRefundStatus } from '../../constant';
type OrderServerVO = AfterSalesInfo.OrderServerVO;
type ProductVO = AfterSalesInfo.ProductVO;
const columns: ColumnProps<ProductVO>[] = getDetailColumns(1);
interface Props extends RouteComponentProps<{id: any}> {
  orderServerVO: OrderServerVO;
  orderInterceptRecordVO?: any;
}

const AfterSaleApplyInfo = (props: Props) => {
  const orderServerVO = Object.assign({}, props.orderServerVO);
  const orderInterceptRecordVO = props.orderInterceptRecordVO ? Object.assign({}, props.orderInterceptRecordVO): void 0;
  const logColumns: any[] = [];
  const onSuccess = () => {
    APP.dispatch({
      type: `${namespace}/getDetail`,
      payload: {
        id: props.match.params.id,
      },
    });
  }
  const isRefundStatusOf = (status: number) => {
    let orderServerVO = Object.assign({}, props.orderServerVO);
    
    return orderServerVO.refundStatus == status;
    
  }
  console.log('orderInterceptRecordVO', orderInterceptRecordVO)
  return (
    <>
      <Row type="flex" justify="space-between" align="middle">
        <h4>售后申请信息</h4>
        {!isRefundStatusOf(enumRefundStatus.WaitConfirm) && <RemarkModal
          onSuccess={onSuccess}
          refundId={props.match.params.id}
        />}
      </Row>
      <Row gutter={24}>
        <Col span={8}>售后类型：{refundType.getValue(orderServerVO.refundType)}</Col>
        <Col span={8}>售后原因：{orderServerVO.returnReasonStr}</Col>
        <Col span={8}>
          申请时间：{moment(orderServerVO.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Col>
        {orderServerVO.handleTime > 0 && (
          <Col span={8}>
            最后处理时间：{moment(orderServerVO.handleTime).format('YYYY-MM-DD HH:mm:ss')}
          </Col>
        )}
        {orderServerVO.operator && <Col span={8}>处理人:{orderServerVO.operator}</Col>}
        <Col span={8}>申请人类型：{createType.getValue(orderServerVO.createType)}</Col>
        <Col span={8}>申请售后数目：{orderServerVO.serverNum}</Col>
        <Col span={8}>申请售后金额：{orderServerVO.amount && formatMoneyWithSign(orderServerVO.amount)}</Col>
        <Col span={8}>售后说明：{orderServerVO.info}</Col>
      </Row>
      <Row>
        <Col>
          图片凭证：
          {orderServerVO.imgUrl && (
            <PicturesWall
              disabled={true}
              readOnly={true}
              imgUrl={replaceHttpUrl(orderServerVO.imgUrl)}
            />
          )}
        </Col>
      </Row>
      {orderInterceptRecordVO && orderInterceptRecordVO.interceptId && (
      <Row gutter={24}>
        <Col span={8}>是否是拦截订单：是</Col>
        <Col span={8}>拦截人：{orderInterceptRecordVO.memberName}</Col>
        <Col span={8}>
          拦截人手机号：{orderInterceptRecordVO.memberPhone}
        </Col>
        <Col span={8}>拦截人地址：{orderInterceptRecordVO.address}</Col>
      </Row>)}
      <Row className="mb20">
        <h4>售后商品</h4>
        <Table
          rowKey={(record: ProductVO) => String(record.productId)}
          pagination={false}
          columns={columns}
          dataSource={orderServerVO.productVO || []}
        />
      </Row>
      <Row>
        {(orderServerVO.commentListVO || []).map(v => (
          <Col key={v.createTime}>
            备注：{(Array.isArray(v.info) && v.info.length > 0) ? v.info[v.info.length -1].value: ''}（{formatDate(v.createTime)} {v.name}）
          </Col>
        ))}
      </Row>
    </>
  );
};
export default withRouter(AfterSaleApplyInfo);
