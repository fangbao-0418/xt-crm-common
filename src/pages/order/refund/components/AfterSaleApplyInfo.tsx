import React from 'react';
import { Card, Row, Col, Table } from 'antd';
import { createType, refundType } from '@/enum';
import PicturesWall from '../../components/pictures-wall';
import { getDetailColumns } from '../../constant';
import { replaceHttpUrl } from '@/util/utils';
import { formatMoneyWithSign, formatDate } from '@/pages/helper';
import { ColumnProps } from 'antd/es/table';
import moment from 'moment';
type OrderServerVO = AfterSalesInfo.OrderServerVO;
type ProductVO = AfterSalesInfo.ProductVO
const columns: ColumnProps<ProductVO>[] = getDetailColumns();
interface Props extends React.Props<{}> {
  orderServerVO: OrderServerVO
}

const AfterSaleApplyInfo = (props: Props) => {
  const { orderServerVO } = props
  const logColumns: any[] = []
  return (
    <Card
      style={{ marginTop: '0' }}>
      <h4>售后申请信息</h4>
      <Row gutter={24}>
        <Col span={8}>售后类型：{refundType.getValue(orderServerVO.refundType)}</Col>
        <Col span={8}>售后原因：{orderServerVO.returnReasonStr}</Col>
        <Col span={8}>申请时间：{moment(orderServerVO.createTime).format('YYYY-MM-DD HH:mm:ss')}</Col>
        <Col span={8}>申请人类型：{createType.getValue(orderServerVO.createType)}</Col>
        <Col span={8}>申请售后数目：{orderServerVO.serverNum}</Col>
        <Col span={8}>申请售后金额：{formatMoneyWithSign(orderServerVO.amount)}</Col>
        <Col span={8}>售后说明：{orderServerVO.info}</Col>
      </Row>
      <Row>
        <Col>
          图片凭证：{orderServerVO.imgUrl && <PicturesWall disabled={true} readOnly={true} imgUrl={replaceHttpUrl(orderServerVO.imgUrl)} />}
        </Col>
      </Row>
      <Row className="mb20">
        <h4>售后商品</h4>
        <Table rowKey={(record: ProductVO) => String(record.productId)} pagination={false} columns={columns} dataSource={orderServerVO.productVO || []} />
      </Row>
      <Row>
        {(orderServerVO.commentListVO || []).map(v => <Col key={v.createTime}>{v.info['操作'] + ' ' + v.info['备注内容']}（{formatDate(v.createTime)} {v.name}）</Col>)}
        <Col></Col>
      </Row>
    </Card>
  )
}
export default AfterSaleApplyInfo;