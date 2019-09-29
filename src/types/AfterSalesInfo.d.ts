declare module AfterSalesInfo {
  export interface OrderServerVO {
    id: number;
    orderCode: string;
    createTime: number;
    finishTime: number;
    handleTime: number;
    operator: string;
    refundType: string;
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

