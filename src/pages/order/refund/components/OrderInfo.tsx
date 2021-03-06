import React from 'react'
import { Card, Row, Col, Table, Avatar } from 'antd'
import { getDetailColumns } from '../../constant'
import {
  formatDate,
  joinFilterEmpty,
  formatMoneyWithSign
} from '@/pages/helper'
import { ColumnProps } from 'antd/es/table'
import { Link } from 'react-router-dom'
import {
  logisticsInformationColumns,
  storeTypeMap
} from '../config'
import memberType, { HDMemberType } from '@/enum/memberType'
import moment from 'moment'
type OrderInfoVO = AfterSalesInfo.OrderInfoVO
type OrderServerVO = AfterSalesInfo.OrderServerVO
type ProductVO = AfterSalesInfo.ProductVO
type ShopDTO = AfterSalesInfo.ShopDTO
const columns: ColumnProps<ProductVO>[] = getDetailColumns()
interface Props extends React.Props<{}> {
  restData?: any
  orderInfoVO: OrderInfoVO
  orderServerVO: OrderServerVO,
  shopDTO: ShopDTO
}
const OrderInfo: React.FC<Props> = (props: Props) => {
  const orderInfoVO = Object.assign({}, props.orderInfoVO)
  const orderServerVO = Object.assign({}, props.orderServerVO)
  const shopDTO = props.shopDTO
  const restData = props.restData
  return (
    <Card>
      <h4 style={{ marginTop: 0 }}>订单信息</h4>
      <Row gutter={24}>
        <Col span={8}>
          主订单号：
          <Link
            to={`/order/detail/${orderInfoVO.mainOrderCode}`}
          >
            {orderInfoVO.mainOrderCode}
          </Link>
        </Col>
        <Col span={8}>
          子订单号：{orderInfoVO.childOrderCode}
        </Col>
        <Col span={8}>
          订单状态：{orderInfoVO.orderStatusStr}
        </Col>
        <Col span={8}>
          订单渠道：{orderServerVO.bizTypeStr}
        </Col>
        <Col span={8}>
          订单类型：{
            APP.constant.orderTypeConfig[
              String(orderInfoVO.orderType)
            ]
          }
        </Col>
        <Col
          hidden={String(orderInfoVO.orderType) !== '70'}
          span={8}
        >
          清关完成时间：{!!orderInfoVO.customsClearanceTime &&
            APP.fn.formatDate(
              orderInfoVO.customsClearanceTime
            )}
        </Col>
        <Col span={8}>订单来源：{orderInfoVO.platform}</Col>
        <Col span={8}>
          供应商订单号：{orderInfoVO.storeOrderId}
        </Col>
        <Col span={8}>买家名称：{orderInfoVO.name}</Col>
        <Col span={8}>联系电话：{orderInfoVO.phone}</Col>
        <Col span={8}>
          实付金额: {formatMoneyWithSign(orderInfoVO.payMoney)}
        </Col>
        <Col span={8}>
          运费: {formatMoneyWithSign(orderInfoVO.freight)}
        </Col>
        <Col span={8}>积分抵扣：{orderInfoVO.pointValue}</Col>
      </Row>
      <Row gutter={24}>
        <Col>
          收货信息：{joinFilterEmpty([
            orderInfoVO.consignee,
            orderInfoVO.consigneePhone,
            orderInfoVO.address
          ])}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>用户备注：{orderInfoVO.remark}</Col>
        <Col span={8}>
        {/* bizType：10喜团优选 bizType：30喜团好店 */}
          会员等级：{Number(orderServerVO.bizType) === 10 ? memberType.getValue(
            orderInfoVO.orderMemberType
          ) : HDMemberType.getValue(orderInfoVO.orderMemberType)}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>支付方式：{orderInfoVO.payTypeStr}</Col>
        <Col span={8}>
          支付时间：{moment(orderInfoVO.payTime).format(
            'YYYY-MM-DD HH:mm:ss'
          )}
        </Col>
        <Col span={8}>
          交易流水号：{orderInfoVO.paymentNumber}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>姓名：{orderInfoVO.realName}</Col>
        <Col span={8}>身份证号：{orderInfoVO.idNo}</Col>
        {/*
          5-未生效 10-保障中 15-理赔成功 20-理赔失败 25-取消
          当运费险为【理赔成功】时显示【赔付金额】
        */}
        <Col span={8}>
          运费险：
          <span
            className='href'
            onClick={() => {
              APP.history.push(`/service/freight-insurance?childOrderCode=${orderInfoVO.childOrderCode}`)
            }}
          >
            {orderInfoVO?.freightInsuranceVO?.insuranceStatusDesc}
          </span>
          {orderInfoVO?.freightInsuranceVO?.insuranceStatus === 15 && <span>赔付金额：{APP.fn.formatMoney(orderInfoVO?.freightInsuranceVO?.insurancePaidAmount)}</span>}
        </Col>
      </Row>
      <h4>供应商信息</h4>
      {shopDTO ? (
        <Row gutter={24}>
          <Col span={8}>
            {shopDTO.shopPictrueFirstUrl ? (
              <Avatar src={shopDTO.shopPictrueFirstUrl} />
            ) : (
              <Avatar icon='user' />
            )}{' '}
            名称：{shopDTO.shopName}
          </Col>
          <Col span={8}>手机号：{shopDTO.shopOwnerPhone}</Col>
          <Col span={8}>
          店铺类型：{storeTypeMap[orderInfoVO.shopType]}
          </Col>
        </Row>
      ) : (
        <Row gutter={24}>
          <Col span={8}>
            名称：{restData?.storeName || '暂无数据'}
          </Col>
        </Row>
      )}
      <Row>
        <h4>物流信息</h4>
        <Table
          rowKey={(record: any) => record.id}
          style={{ width: '400px' }}
          pagination={false}
          columns={logisticsInformationColumns}
          dataSource={orderInfoVO.expressVO || []}
        />
      </Row>
      <Row>
        <Col>
          <span style={{ fontWeight: 'bold' }}>客服备注：</span>
          {Array.isArray(orderInfoVO.orderCommentListVO) &&
            orderInfoVO.orderCommentListVO.map((v) => (
              <Col key={v.createTime}>
                {v.info} （{formatDate(v.createTime)}{' '}
                {v.operator}）
              </Col>
            ))}
        </Col>
      </Row>
    </Card>
  )
}
export default OrderInfo
