/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [对账单分页查询列表↗](http://192.168.20.21/project/223/interface/api/47850) 的 **请求类型**
 *
 * @分类 [对账单相关接口↗](http://192.168.20.21/project/223/interface/api/cat_13772)
 * @标签 `对账单相关接口`
 * @请求头 `GET /financeAccountRecord/getListOnPage`
 * @更新时间 `2020-02-11 14:50:52`
 */
export interface GetListOnPageRequest {}

/**
 * 接口 [对账单分页查询列表↗](http://192.168.20.21/project/223/interface/api/47850) 的 **返回类型**
 *
 * @分类 [对账单相关接口↗](http://192.168.20.21/project/223/interface/api/cat_13772)
 * @标签 `对账单相关接口`
 * @请求头 `GET /financeAccountRecord/getListOnPage`
 * @更新时间 `2020-02-11 14:50:52`
 */
export interface GetListOnPageResponse {
  /**
   * 对账单名称
   */
  accName: string
  /**
   * 对账单状态（10：待确认；20：未结算；30：待结算；40：结算中 50:已结算 60:已结清 70:结算异常）
   */
  accStatus: number
  /**
   * 对账单类型：1供应商对账单 2系统对账单
   */
  accType: number
  /**
   * 生成日期生成T-1天的
   */
  bulidDate: string
  /**
   * 关闭原因
   */
  closeReason: string
  /**
   * 关闭时间
   */
  closeTime: number
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 创建人
   */
  createUid: number
  /**
   * 支出金额
   */
  disburseMoney: number
  /**
   * 支出数量
   */
  disburseNum: number
  /**
   * 完成时间
   */
  finishTime: number
  /**
   * 自增Id
   */
  id: number
  /**
   * 收入金额
   */
  incomeMoney: number
  /**
   * 收入数量
   */
  incomeNum: number
  /**
   * 是否删除
   */
  isDelete: number
  /**
   * 是否已有结算单
   */
  isSettlementRecord: number
  /**
   * 修改时间
   */
  modifyTime: number
  /**
   * 修改人
   */
  modifyUid: number
  /**
   * 序列号
   */
  serialNo: string
  /**
   * 结算金额
   */
  settlementMoney: number
  /**
   * 原始单号
   */
  sourceNo: string
  /**
   * 供应商ID
   */
  storeId: number
  /**
   * 供应商名称
   */
  storeName: string
}

/**
 * 接口 [对账单明细分页查询列表↗](http://192.168.20.21/project/223/interface/api/47959) 的 **请求类型**
 *
 * @分类 [对账单相关接口↗](http://192.168.20.21/project/223/interface/api/cat_13772)
 * @标签 `对账单相关接口`
 * @请求头 `GET /financeAccountRecord/getDetailsListOnPage`
 * @更新时间 `2020-02-11 14:50:52`
 */
export interface GetDetailsListOnPageRequest {
  /**
   * 对账单ID
   */
  accId: string
  /**
   * 页码
   */
  pageNo: string
  /**
   * 每页条数
   */
  pageSize: string
}

/**
 * 接口 [对账单明细分页查询列表↗](http://192.168.20.21/project/223/interface/api/47959) 的 **返回类型**
 *
 * @分类 [对账单相关接口↗](http://192.168.20.21/project/223/interface/api/cat_13772)
 * @标签 `对账单相关接口`
 * @请求头 `GET /financeAccountRecord/getDetailsListOnPage`
 * @更新时间 `2020-02-11 14:50:52`
 */
export interface GetDetailsListOnPageResponse {
  /**
   * 对账单ID
   */
  accId: string
  /**
   * 完成时间
   */
  finishTime: number
  /**
   * 交易金额
   */
  paymentMoney: number
  /**
   * 交易状态（1：完成 2：未完成 3：出现异常）
   */
  paymentStatus: number
  /**
   * 交易类型(1:订单收入 2：售后退款 3：运费收入 4：运费支出 5：优惠券退款)
   */
  paymentType: number
  /**
   * 序列号
   */
  serialNo: string
  /**
   * 序列号
   */
  sourceNo: string
}

/**
 * 接口 [收支明细列表↗](http://192.168.20.21/project/223/interface/api/47960) 的 **请求类型**
 *
 * @分类 [对账单相关接口↗](http://192.168.20.21/project/223/interface/api/cat_13772)
 * @标签 `对账单相关接口`
 * @请求头 `GET /financeAccountRecord/getIcExDetailsListOnPage`
 * @更新时间 `2020-02-11 14:50:52`
 */
export interface GetIcExDetailsListOnPageRequest {
  /**
   * 交易编号
   */
  paymentNo: string
  /**
   * 交易类型
   */
  paymentType: string
  /**
   * 创建开始时间
   */
  createTimeStart: string
  /**
   * 创建结束时间
   */
  createTimeEnd: string
  /**
   * 页码
   */
  pageNo: string
  /**
   * 每页条数
   */
  pageSize: string
}

/**
 * 接口 [收支明细列表↗](http://192.168.20.21/project/223/interface/api/47960) 的 **返回类型**
 *
 * @分类 [对账单相关接口↗](http://192.168.20.21/project/223/interface/api/cat_13772)
 * @标签 `对账单相关接口`
 * @请求头 `GET /financeAccountRecord/getIcExDetailsListOnPage`
 * @更新时间 `2020-02-11 14:50:52`
 */
export interface GetIcExDetailsListOnPageResponse {
  /**
   * 实际入账金额
   */
  actualMoney: number
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 交易金额
   */
  paymentMoney: number
  /**
   * 交易编号
   */
  paymentNo: string
  /**
   * 交易类型
   */
  paymentType: string
  /**
   * 状态
   */
  status: number
}

/**
 * 生成结算单
 */
interface AddSettlementRequest {
  /** 对账单id */
  accIdList: number[]
  /** 发票凭证地址 */
  invoiceUrl: string
  /** 是否新建收款账户，0：否，1：是 */
  newAccount: 0 | 1
  /**
   * 户名
   */
  accoutName?: string
  /**
   * 卡号
   */
  accoutNo?: string
  /**
   * 支行名称
   */
  bankBranchName?: string
  /**
   * 银行编码
   */
  bankCode?: string
  /**
   * 银行名称
   */
  bankName?: string
  /**
   * 城市
   */
  city?: string
  /**
   * 城市ID
   */
  cityId?: number
  /**
   * 创建时间
   */
  createTime?: number
  /**
   * 创建人
   */
  createUid?: number
  /**
   * 自增Id
   */
  id: number
  /**
   * 是否删除
   */
  isDelete?: number
  /**
   * 修改时间
   */
  modifyTime?: number
  /**
   * 修改人
   */
  modifyUid?: number
  /**
   * 1 ：微信 2：支付宝 3：个人银行卡 4：对公账户
   */
  payType?: number
  /**
   * 省份
   */
  province?: string
  /**
   * 省份ID
   */
  provinceId?: number
  /**
   * 供应商id
   */
  supplierUid?: number
  /**
   * 1.供应商端收款账户 2.crm端收款账户
   */
  type?: number
  /** 省市 */
  area?: {name: string, value: string}[]
}

/* prettier-ignore-end */
