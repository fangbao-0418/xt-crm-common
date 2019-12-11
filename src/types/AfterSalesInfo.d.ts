declare module AfterSalesInfo {
  export interface data {
    cancel: boolean;
    id: number;
    refundStatus: number;
    refundType: any;
    isDelete: number;
    orderServerVO: OrderServerVO;
    orderInterceptRecordVO: any;
    orderInfoVO: OrderInfoVO;
    checkVO: CheckVO;
    skuServerLogVO: any[];
  }
  export interface CheckVO {
    amount: number;
    refundAmount: number;
    refundType: any;
    refundStatus: number;
    firstRefundStatusStr: null;
    refundStatusStr: null;
    serverDescribe: string;
    firstServerDescribe: string;
    returnContact: string;
    returnPhone: string;
    returnAddress: string;
    returnExpressName: string;
    returnExpressCode: string;
    returnExpressTime: number;
    sendExpressName: string;
    sendExpressCode: string;
    sendExpressTime: number;
    sendExpressId: string;
    isRefundFreight: number;
    freight: number;
    serverNum: number;
    unitPrice: number;
    maxServerNum:number;
    maxRefundAmount: number;
    reply: string;
    isDemotion: number;
    demotionInfo: string;
  }
  export interface OrderInfoVO {
    mainOrderId: number;
    mainOrderCode: string;
    childOrderId: number;
    childOrderCode: string;
    orderStatusStr: string;
    name: null;
    phone: string;
    platform: string;
    consignee: string;
    consigneePhone: string;
    address: string;
    remark: string;
    orderTime: number;
    finishTime: number;
    payTypeStr: string;
    payTime: number;
    paymentNumber: string;
    expressVO: any[];
    orderMemberType: number;
    payMoney: number;
    freight: number;
    /** 0：普通订单，10：激活码订单，20：地推订单，30：活动兑换订单，40：采购订单，60：团购会订单，70：海淘订单*/
    orderType: 0 | 10 | 20 | 30 | 40 | 60 | 70;
    customsClearanceTime: number;
    realName: string;
    idNo: number;
    orderCommentListVO: any[];
  }
  export interface OrderServerVO {
    id: number;
    orderCode: string;
    createTime: number;
    finishTime: number;
    handleTime: number;
    operator: string;
    refundType: any;
    refundTypeStr: string;
    returnReason: number;
    returnReasonStr: string;
    info: string;
    serverDescribe: string;
    imgUrl: string;
    refundStatus: number;
    refundStatusStr: string;
    amount: number;
    refundAmount: number;
    refundErrorMsg: null;
    isDelete: number;
    productVO: ProductVO[];
    commentListVO: any[];
    createType: number;
    alreadyRefundAmount: number;
    storeName: string;
    storeType: number;
    supplierOperate: number;
    supplierInfo: null;
    serverNum: number;
    contactVO: any;
    beforeStatus: number;
    reply: string;
  }

  export interface ProductVO {
    mainOrderId: number;
    childOrderId: number;
    productId: number;
    promotionId: number;
    productImage: string;
    skuId: number;
    skuName: string;
    quantity: number;
    salePrice: number;
    saleTotalPrice: number;
    faceValue: string;
    discountPrice: number;
    dealPrice: number;
    dealTotalPrice: number;
    preferentialTotalPrice: number;
    properties: string;
    storeId: number;
    storeName: string;
    canApply: boolean;
    errormsg: null;
    skuServerId: null;
    canShowHistoryBtn: boolean;
    ableRefundAmount: number;
    alreadyRefundSkuAmount: number;
  }
}




