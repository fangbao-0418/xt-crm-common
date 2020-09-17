declare module AfterSalesInfo {
  export interface data {
    supplierHandLogS: any[];
    cancel: boolean;
    id: number;
    refundStatus: number;
    refundType: any;
    isDelete: number;
    orderServerVO: OrderServerVO;
    orderInterceptRecordVO: any;
    orderInfoVO: OrderInfoVO;
    checkVO: CheckVO;
    expirationClose: number | null;
    skuServerLogVO: any[];
    shopDTO: ShopDTO;
    /** 自营仓名称 */
    warehouseName: string | null;
    /** 供应商名称 */
    storeName: string | null;
    /** 供应商收货状态：10 已收货 20 已发货 30 完成 60 拒绝 */
    warehouseOperate: 10 | 20 | 30 | 60;
    /** 类型：0 默认CRM 1供应商 2 自营仓 */
    handleChannel: 0 | 1 | 2;
    /** 物流备注 */
    returnExpressRemark: string;
    supplierResHandTime: number;
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
    maxServerNum: number;
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
    /* 供应商订单号 */
    storeOrderId: number;
    /** 0：普通订单，10：激活码订单，20：地推订单，30：活动兑换订单，40：采购订单，60：团购会订单，70：海淘订单，80：团购会采购订单*/
    orderType: 0 | 10 | 20 | 30 | 40 | 60 | 70 | 80
    customsClearanceTime: number;
    realName: string;
    idNo: number;
    orderCommentListVO: any[];
    // 1: '喜团自营店',2: '直播小店',3: '品牌旗舰店', 4: '品牌专营店',5: '喜团工厂店', 6: '普通企业店'
    shopType: 1 | 2 | 3 | 4 | 5 | 6
    /** 积分 */
    pointValue: string
    salePrice?: number // 单价
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
    /* 自动审核售后编号 */
    refundAutoDisposeNo?: string;
    bizTypeStr: string
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

  export interface ShopDTO {
    shopType: 1 | 2 | 3 | 4 | 5 | 6;
    shopCode: string;
    shopName: string;
    shopOwnerPhone: string;
    shopPictrueUrl: string;
    shopPictrueFirstUrl: string;
  }
}
