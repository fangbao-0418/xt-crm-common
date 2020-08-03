const { post, newPost } = APP.http
import { exportFile } from '@/util/fetch'

/* 获取补偿订单列表 */
export function getOrderlist (data: any) {
  return post('/order/afterSale/list', {
    ...data,
    refundStatus: [10]
  })
}

/* 获取补偿方式或补偿类型列表 */
export function getCompensatePayList () {
  /* orderBizType 订单业务类型 0-喜团订单，10-买菜订单 */
  return Promise.resolve([
    {
      compensatePayType: 1,
      compensatePayName: '优惠券补偿',
      orderBizType: 0
    },
    {
      compensatePayType: 2,
      compensatePayName: '现金补偿',
      orderBizType: 0
    }
  ])
  // return post('/crm/order/compensate/compensatePayList', data)
}

/* 获取责任归属列表 */
export function getResponsibilityList () {
  /* orderBizType 订单业务类型 0-喜团订单，10-买菜订单 */
  return Promise.resolve([
    {
      responsibilityType: 1,
      responsibilityName: '优惠券补偿',
      orderBizType: 0
    },
    {
      responsibilityType: 2,
      responsibilityName: '现金补偿',
      orderBizType: 0
    }
  ])
  // return post('/crm/order/compensate/responsibilityList', data)
}

/* 获取店铺列表 */
export function getSupplierList (data: any) {
  /* searchType 1. 店铺,2.供应商 */
  // return Promise.resolve([
  //   {
  //     id: 1,
  //     name: '优惠券补偿'
  //   },
  //   {
  //     id: 2,
  //     name: '现金补偿'
  //   }
  // ])
  return newPost('/mmweb/supplier/shop/V1/search', data)
}

/* 补偿详情 */
export function getCompensateDetail (data: { compensateCode: string }) {
  return Promise.resolve({
    creatorId: 1
  })
  // return newPost('/crm/order/compensate/getCompensateDetail', data)
}

/* 补偿单记录 */
export function getCompensateRecord (data: any) {
  return newPost('/crm/order/compensate/getCompensateRecord', data)
}

/* 补偿单导出 */
export function exportCompensate (data: any) {
  return exportFile('/crm/order/compensate/exportCompensate', data)
}