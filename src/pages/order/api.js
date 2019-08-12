import { post, exportFile, prefix, get, put, fetch } from '../../util/fetch';
const debug = false;
var qs = require('qs');

export function getOrderList(data) {
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

export function againRefund(id) {
  return put(`/order/afterSale/againRefund/{id}`);
}
export function closeOrder(id) {
  return put(`/order/afterSale/close/{id}`);
}
export function saveRefundInfo(data) {
  return post('/order/afterSale/saveRefundInfo', data)
}
export function queryOrderDetail(data) {
  if (debug) {
    return Promise.resolve(detail);
  }
  return post('/order/detail', data);
}

export function push1688(childOrderId) {
  return get('/order/push1688', { childOrderId: childOrderId })
}

export function withhold(childOrderId) {
  return get('/order/protocolPay', { childOrderId: childOrderId })
}

export function setOrderRemark(data) {
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/order/saveInfo', data);
}

export function setRefundOrderRemark(data) {
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/order/saveRefundInfo', data);
}

export function deliveryOrder(data) {
  console.log('deliveryOrder', data);
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/order/delivery', data);
}

export function deliveryChildOrder(data) {
  console.log('deliveryChildOrder', data);
  if (debug) {
    return Promise.resolve(true);
  }
  return post(`/order/${data.orderId}/delivery`, data);
}

export function updateLogisticsInfo(data) {
  return post('/order/updateOrderExpress', data);
}

export function addLogisticsInfo(data) {
  return post('/order/addOrderExpress', data);
}

export function getRefundOrderDetail(data) {
  return post('/order/afterSalesInfo', data);
}

export function refundOperate(data) {
  return fetch('/order/afterSale/auditOperate', {
    method: 'POST',
    data
  });
}

export function customerAdd(data) {
  return fetch('/order/afterSale/customerAdd', {
    method: 'POST',
    data
  })
}
export function refundList(data) {
  return fetch('/order/afterSale/list', {
    method: 'POST',
    data
  });
}

export function refundDetail(params) {
  return fetch(`/order/afterSale/afterSalesInfo?${qs.stringify(params)}`)
}
export function exportOrder(data) {
  return exportFile('/order/export', data);
}

export const importLogistics = prefix('/order/logistics/import');

export function getRefundOrderInfo(params) {
  return fetch(`/order/afterSalesInfo?${qs.stringify(params)}`);
}

export function refundAgain(data) {
  return post(`/order/afterSale/againRefund/${data.id}`);
}

export function closeRefund(data) {
  return post(`/order/afterSale/close/${data.id}`);
}

export function exportRefund(data) {
  return exportFile('/order/afterSale/export', data);
}
