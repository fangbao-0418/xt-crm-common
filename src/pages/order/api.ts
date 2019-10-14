import { post, exportFile, get, put, newPut, newPost, fetch } from '../../util/fetch';
import { prefix } from '../../util/utils';
const debug = false;
var qs = require('qs');

export function getOrderList(data: any) {
  return post('/order/list', data);
}

const detail = {
  buyerInfo: {
    buyerWords: 'string',
    contact: 'string',
    idCard: 'string',
    memberAddress: {
      city: 'string',
      cityId: 0,
      consignee: 'string',
      defaultAddress: 0,
      district: 'string',
      districtId: 0,
      freight: 0,
      id: 0,
      phone: 'string',
      province: 'string',
      provinceId: 0,
      street: 'string',
    },
    nickname: 'string',
    payType: 'string',
    phone: 'string',
    userName: 'string',
  },
  orderStatusLogList: [
    {
      createTime: Date.now(),
      orderStatus: 10,
    },
  ],
  freight: 0,
  logisticsList: [
    {
      expressCode: 'string',
      expressCompanyName: 'string',
      expressName: 'string',
      orderCode: 'string',
      productImg: 'string',
      status: 0,
      storeName: 'string',
    },
  ],
  orderInfo: {
    childOrderList: [
      {
        createTime: 0,
        orderCode: 'string',
        paymentNumber: 'string',
        storeName: 'string',
      },
    ],
    createTime: 0,
    orderCode: 'string',
    orderStatus: 60,
    paymentNumber: 'string',
    remark: 'string',
  },
  orderYield: {
    costPrice: 0,
    memberYieldVOList: [
      {
        memberType: 0,
        userName: 'yugan',
        yield: 99,
      },
    ],
    totalPrice: 0,
  },
  skuList: [
    {
      barCode: 'string',
      coverUrl: 'string',
      id: 0,
      marketPrice: 0,
      num: 0,
      productId: 0,
      skuCode: 'string',
      skuName: 'string',
      totalPrice: 0,
    },
  ],
  taxPrice: 0,
  totalPrice: 0,
};

// 客服代申请售后单个商品详情
export function getProductDetail({mainOrderId, skuId}: any) {
  return get(`/order/afterSale/applyOrderSKuDetail/${mainOrderId}/${skuId}`)
}
// 获取售后原因
export function customerUpdate(data: any) {
  return newPut('/order/afterSale/customerUpdate', data);
}
// 获取售后原因
export function getRefundReason() {
  return get('/order/afterSale/getRefundReason');
}
// 重新退款
export function againRefund(id: number, info: any) {
  return put(`/order/afterSale/againRefund/${id}`, {info});
}
/**
 * 更新物流信息接口
 */
export function updateOrderExpress(data: any) {
  return post('/order/afterSale/updateOrderExpress', data)
}
/**
 * 完成订单
 * @param id 
 * @param info 
 */
export function closeOrder(id: number, info: any) {
  return put(`/order/afterSale/close/${id}`, {info});
}
/**
 * 确认收货
 * @param skuServerId 
 */
export function confirmReceipt(skuServerId: number) {
  return newPost(`/order/afterSale/confirm/${skuServerId}`)
}
/**
 * 售后轨迹详情
 * @param skuServerId 
 */
export function getSkuServerProcessDetailList(skuServerId: number) {
  return get(`/order/afterSale/getSkuServerProcessDetailList/${skuServerId}`)
}
export function saveRefundInfo(data: any) {
  return post('/order/afterSale/saveRefundInfo', data)
}
export function queryOrderDetail(data: any) {
  if (debug) {
    return Promise.resolve(detail);
  }
  return post('/order/detail', data);
}

export function push1688(childOrderId: number) {
  return get('/order/push1688', { childOrderId: childOrderId })
}

export function withhold(childOrderId: number) {
  return get('/order/protocolPay', { childOrderId: childOrderId })
}

export function setOrderRemark(data: any) {
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/order/saveInfo', data);
}

export function setRefundOrderRemark(data: any) {
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/order/afterSale/saveRefundInfo', data);
}

export function deliveryOrder(data: any) {
  console.log('deliveryOrder', data);
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/order/delivery', data);
}

export function deliveryChildOrder(data: any) {
  console.log('deliveryChildOrder', data);
  if (debug) {
    return Promise.resolve(true);
  }
  return post(`/order/${data.orderId}/delivery`, data);
}

export function updateLogisticsInfo(data: any) {
  return post('/order/updateOrderExpress', data);
}

export function addLogisticsInfo(data: any) {
  return post('/order/addOrderExpress', data);
}

export function getRefundOrderDetail(data: any) {
  return post('/order/afterSalesInfo', data);
}

export function refundOperate(data: any) {
  return newPost('/order/afterSale/auditOperate', data);
}

export function getStoreList(data: any) {
  return fetch('/store/list', {
    method: 'POST',
    data
  });
}
export function customerAdd(data: any) {
  return fetch('/order/afterSale/customerAdd', {
    method: 'POST',
    data
  })
}
export function customerAddCheck(data: any) {
  return fetch('/order/afterSale/check/downgrade', {
    method: 'POST',
    data
  });
}

export function refundList(data: any) {
  return fetch('/order/afterSale/list', {
    method: 'POST',
    data
  });
}

export function refundDetail(params: any) {
  return fetch(`/order/afterSale/afterSalesInfo?${qs.stringify(params)}`)
}
export function exportOrder(data: any) {
  return exportFile('/order/export', data);
}

export const importLogistics = prefix('/order/logistics/import');

export function getRefundOrderInfo(params: any) {
  return fetch(`/order/afterSalesInfo?${qs.stringify(params)}`);
}

export function refundAgain(data: any) {
  return put(`/order/afterSale/againRefund/${data.id}`);
}

export function closeRefund(data: any) {
  return post(`/order/afterSale/close/${data.id}`);
}

export function exportRefund(data: any) {
  return exportFile('/order/afterSale/export', data);
}

export function profitRecal(data: any) {
  return fetch('/order/profit/recal', {
    method: 'POST',
    data
  });
}
export function profitRecycl(data: any) {
  return fetch('/order/profit/recycling', {
    method: 'POST',
    data
  });
}


