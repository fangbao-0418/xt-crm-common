/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/** 调整单列表记录属性 */
export interface ListRecordProps {
  /** 单据金额 */
  billMoney: number
  /** 单据名称 */
  billName: string
  /** 单据状态，10：待初审，20：待复审，30：审核通过，40：审核不通过，50：已撤销 */
  billStatus: 10 | 20  | 30 | 40 | 50
  /** 单据收支类型，10：收入，20：支出 */
  billType: 10 | 20
  /** 创建人名称 */
  createName: string
  /** 创建人类型，10：员工 */
  createType: 10
  /** 创建人id */
  createUid: number
  /** 文件凭证 */
  fileVoucher: string
  /** 完成时间，（审核通过，审核不通过，撤销） */
  finishTime: number
  /** 初审人名称 */
  firstVerifyName: string
  /** 初审时间 */
  firstVerifyTime: number
  /** 图片凭证 */
  imgVoucher: string
  /** 复审人名称 */
  secondVerifyName: string
  /** 复审时间 */
  secondVerifyTime: number
  /** 序列号 */
  serialNo: any
  /** 供应商id */
  supplierId: number
  /** 供应商名称 */
  supplierName: string
}

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [调整单列表↗](http://192.168.20.21/project/223/interface/api/47853) 的 **请求类型**
 *
 * @分类 [调整单↗](http://192.168.20.21/project/223/interface/api/cat_13956)
 * @标签 `调整单`
 * @请求头 `POST /financeTrimRecord/list`
 * @更新时间 `2020-02-11 14:50:53`
 */
export interface ListRequest {
  /**
   * 对账单ID
   */
  accId: number
  /**
   * 创建时间开始
   */
  createTimeBegin: number
  /**
   * 创建时间借宿
   */
  createTimeEnd: number
  /**
   * 自增Id
   */
  id: number
  /**
   * 调整原因 1订单补发、2平台补贴、3运费补贴、4售后扣款、5售后补偿
   */
  trimReason: number
  /**
   * 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效
   */
  trimStatus: number
  /**
   * 调整类型（1：收入 2：支出）
   */
  trimType: number
  pageNum: number
  pageSize: number
  /** 采购审核人名称 */
  purchaseReviewName: string
  /** 财务审核人名称 */
  financeReviewName: string
}

/**
 * 接口 [调整单列表↗](http://192.168.20.21/project/223/interface/api/47853) 的 **返回类型**
 *
 * @分类 [调整单↗](http://192.168.20.21/project/223/interface/api/cat_13956)
 * @标签 `调整单`
 * @请求头 `POST /financeTrimRecord/list`
 * @更新时间 `2020-02-11 14:50:53`
 */
export interface ListResponse {
  /**
   * 对账单ID
   */
  accId: number
  /**
   * 对账单名称
   */
  accName: string
  /**
   * 关闭原因
   */
  closeReason: string
  /**
   * 关闭时间
   */
  closeTime: number
  /**
   * 创建人名称
   */
  createName: string
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 创建人
   */
  createUid: number
  /**
   * 创建者类型：0：财务 1：采购：2员工：3供应商
   */
  createdType: number
  /**
   * 财务人调整单附件id
   */
  financeReviewEnclosureId: number
  /**
   * 财务审核人名称
   */
  financeReviewName: string
  /**
   * 对账单状态（0审核通过 1审核不通过）
   */
  financeReviewStatus: number
  /**
   * 财务审核时间
   */
  financeReviewTime: number
  /**
   * 财务审核人
   */
  financeReviewUid: number
  /**
   * 完成时间
   */
  finishTime: number
  /**
   * 自增Id
   */
  id: number
  /**
   * 是否删除
   */
  isDelete: number
  /**
   * 修改时间
   */
  modifyTime: number
  /**
   * 修改人
   */
  modifyUid: number
  /**
   * 采购人调整单附件id
   */
  purchaseReviewEnclosureId: number
  /**
   * 采购审核人名称
   */
  purchaseReviewName: string
  /**
   * 对账单状态（0审核通过 1审核不通过）
   */
  purchaseReviewStatus: number
  /**
   * 采购审核时间
   */
  purchaseReviewTime: number
  /**
   * 采购审核人
   */
  purchaseReviewUid: number
  /**
   * 备注
   */
  remark: string
  /**
   * 序列号
   */
  serialNo: string
  /**
   * 供应商id
   */
  supplierUid: number
  /**
   * 调整单附件id
   */
  trimEnclosureId: number
  /**
   * 调整金额
   */
  trimMoney: number
  /**
   * 调整单名称
   */
  trimName: string
  /**
   * 调整原因 1订单补发、2平台补贴、3运费补贴、4售后扣款、5售后补偿
   */
  trimReason: number
  /**
   * 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效
   */
  trimStatus: number
  /**
   * 调整类型（1：收入 2：支出）
   */
  trimType: number
}

/**
 * 接口 [调整单撤销↗](http://192.168.20.21/project/223/interface/api/47854) 的 **请求类型**
 *
 * @分类 [调整单↗](http://192.168.20.21/project/223/interface/api/cat_13956)
 * @标签 `调整单`
 * @请求头 `GET /financeTrimRecord/revoke`
 * @更新时间 `2020-02-11 14:50:53`
 */
export interface RevokeRequest {
  /**
   * id
   */
  id: string
}

/**
 * 接口 [调整单撤销↗](http://192.168.20.21/project/223/interface/api/47854) 的 **返回类型**
 *
 * @分类 [调整单↗](http://192.168.20.21/project/223/interface/api/cat_13956)
 * @标签 `调整单`
 * @请求头 `GET /financeTrimRecord/revoke`
 * @更新时间 `2020-02-11 14:50:53`
 */
export type RevokeResponse = boolean

/**
 * 接口 [调整单生成↗](http://192.168.20.21/project/223/interface/api/47851) 的 **请求类型**
 *
 * @分类 [调整单↗](http://192.168.20.21/project/223/interface/api/cat_13956)
 * @标签 `调整单`
 * @请求头 `POST /financeTrimRecord/build`
 * @更新时间 `2020-02-11 14:50:52`
 */
export interface BuildRequest {
  /**
   * 对账单ID
   */
  accId: number
  /**
   * 对账单名称
   */
  accName: string
  /**
   * 关闭原因
   */
  closeReason: string
  /**
   * 关闭时间
   */
  closeTime: number
  /**
   * 创建人名称
   */
  createName: string
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 创建人
   */
  createUid: number
  /**
   * 创建者类型：0：财务 1：采购：2员工：3供应商
   */
  createdType: number
  /**
   * 财务人调整单附件id
   */
  financeReviewEnclosureId: number
  /**
   * 财务审核人名称
   */
  financeReviewName: string
  /**
   * 对账单状态（0审核通过 1审核不通过）
   */
  financeReviewStatus: number
  /**
   * 财务审核时间
   */
  financeReviewTime: number
  /**
   * 财务审核人
   */
  financeReviewUid: number
  /**
   * 完成时间
   */
  finishTime: number
  /**
   * 自增Id
   */
  id: number
  /**
   * 是否删除
   */
  isDelete: number
  /**
   * 修改时间
   */
  modifyTime: number
  /**
   * 修改人
   */
  modifyUid: number
  /**
   * 采购人调整单附件id
   */
  purchaseReviewEnclosureId: number
  /**
   * 采购审核人名称
   */
  purchaseReviewName: string
  /**
   * 对账单状态（0审核通过 1审核不通过）
   */
  purchaseReviewStatus: number
  /**
   * 采购审核时间
   */
  purchaseReviewTime: number
  /**
   * 采购审核人
   */
  purchaseReviewUid: number
  /**
   * 备注
   */
  remark: string
  /**
   * 序列号
   */
  serialNo: string
  /**
   * 供应商id
   */
  supplierUid: number
  /**
   * 调整单附件id
   */
  trimEnclosureId: number
  /**
   * 调整金额
   */
  trimMoney: number
  /**
   * 调整单名称
   */
  trimName: string
  /**
   * 调整原因 1订单补发、2平台补贴、3运费补贴、4售后扣款、5售后补偿
   */
  trimReason: number
  /**
   * 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效
   */
  trimStatus: number
  /**
   * 调整类型（1：收入 2：支出）
   */
  trimType: number
}

/**
 * 接口 [调整单生成↗](http://192.168.20.21/project/223/interface/api/47851) 的 **返回类型**
 *
 * @分类 [调整单↗](http://192.168.20.21/project/223/interface/api/cat_13956)
 * @标签 `调整单`
 * @请求头 `POST /financeTrimRecord/build`
 * @更新时间 `2020-02-11 14:50:52`
 */
export type BuildResponse = boolean

/**
 * 接口 [调整单详情↗](http://192.168.20.21/project/223/interface/api/47852) 的 **请求类型**
 *
 * @分类 [调整单↗](http://192.168.20.21/project/223/interface/api/cat_13956)
 * @标签 `调整单`
 * @请求头 `GET /financeTrimRecord/info`
 * @更新时间 `2020-02-11 14:50:53`
 */
export interface InfoRequest {
  /**
   * id
   */
  id: string
}

export interface InfoResponse {
  /** 调整单id */
  serialNo: any
  /** 调整金额 */
  billMoney: number
  /** 文件凭证 */
  fileVoucher: string
  /** 图片凭证 */
  imgVoucher: string
  /** 初审时间 */
  firstVerifyTime: number
  /** 复审时间 */
  secondVerifyTime: number
  /** 初审信息 */
  firstVerifyInfo: any
  /** 复审信息 */
  secondVerifyInfo: any
  /** 单据状态，10：待初审，20：待复审，30：审核通过，40：审核不通过，50：已撤销 */
  billStatus: 10 | 20 | 30 | 40 | 50
  /**
   * 对账单ID
   */
  accId: number
  /**
   * 对账单单号
   */
  accNo: string
  /**
   * 对账单名称
   */
  accName: string
  /**
   * 关闭原因
   */
  closeReason: string
  /**
   * 关闭时间
   */
  closeTime: number
  /**
   * 创建人名称
   */
  createName: string
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 创建人
   */
  createUid: number
  /**
   * 创建者类型：0：财务 1：采购：2员工：3供应商
   */
  createdType: number
  /**
   * 财务人调整单附件id
   */
  financeReviewEnclosureId: number
  /**
   * 财务审核人名称
   */
  financeReviewName: string
  /**
   * 财务审核状态（0审核通过 1审核不通过）
   */
  financeReviewStatus: number
  /**
   * 财务审核时间
   */
  financeReviewTime: number
  /**
   * 财务审核人
   */
  financeReviewUid: number
  /**
   * 完成时间
   */
  finishTime: number
  /**
   * 自增Id
   */
  id: number
  /**
   * 是否删除
   */
  isDelete: number
  /**
   * 修改时间
   */
  modifyTime: number
  /**
   * 修改人
   */
  modifyUid: number
  /**
   * 采购人调整单附件id
   */
  purchaseReviewEnclosureId: number
  /**
   * 采购审核人名称
   */
  purchaseReviewName: string
  /**
   * 采购审核状态（0审核通过 1审核不通过）
   */
  purchaseReviewStatus: number
  /**
   * 采购审核时间
   */
  purchaseReviewTime: number
  /**
   * 采购审核人
   */
  purchaseReviewUid: number
  /**
   * 备注
   */
  remark: string
  /**
   * 序列号
   */
  serialNo: string
  /**
   * 供应商id
   */
  supplierUid: number
  /**
   * 调整单附件id
   */
  trimEnclosureId: number
  /**
   * 调整金额
   */
  trimMoney: number
  /**
   * 调整单名称
   */
  trimName: string
  /**
   * 调整原因 1订单补发、2平台补贴、3运费补贴、4售后扣款、5售后补偿
   */
  trimReason: number
  /**
   * 对账单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效
   */
  trimStatus: number
  /**
   * 调整类型（1：收入 2：支出）
   */
  trimType: number
  /**
   * 调整说明
   */
  trimExplain: string
  /**
   * 文件
   */
  trimFileUrl: {url: string}[]
  /**
   * 图
   */
  trimImgUrl: {url: string}[]
  /**
   * 调整信息
   */
  trimEnclosure: {
    createTime: number
    createUid: number
    id: number
    isDelete: number
    modifyTime: number
    modifyUid: number
    /**
     * 调整说明
     */
    trimExplain: string
    /**
     * 文件
     */
    trimFileUrl: string
    trimId: number
    /**
     * 图
     */
    trimImgUrl: string
  }
  /** 采购审核信息 */
  purchaseReviewEnclosure: ReviewEnclosure
  /** 财务审核信息 */
  financeReviewEnclosure: ReviewEnclosure
}

interface ReviewEnclosure {
  /** 审核人名称 */
  auditName: string
  /** 审核意见，10：审核通过，20：审核不通过 */
  auditOpinion: 10 | 20
  /** 审核说明 */
  auditRemark: string
  /** 图片凭证 */
  imgVoucher: any
  /** 文件凭证 */
  fileVoucher: any
}

/**
 * 接口 [审核↗](http://192.168.20.21/project/218/interface/api/48908) 的 **请求类型**
 *
 * @分类 [crm财务结算--调整单↗](http://192.168.20.21/project/218/interface/api/cat_15164)
 * @标签 `crm财务结算--审核`
 * @请求头 `POST /finance/trimRecord/examine`
 * @更新时间 `2020-02-15 10:13:44`
 */
export interface ExamineRequest {
  /**
   * 对账单状态（0审核通过 1审核不通过）
   */
  reviewStatus: number
  trimExplain: string
  trimFileUrl: string
  trimId: number
  trimImgUrl: string
  userDTO: {
    roleId: number
    userId: number
    userName: string
  }
}

/* prettier-ignore-end */
