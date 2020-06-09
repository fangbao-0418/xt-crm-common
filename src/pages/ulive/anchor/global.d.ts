declare namespace Anchor {
  /** 10-公司, 20-供应商, 30-网红主播, 40-买家 */
  type AnchorIdentityType = 10 | 20 | 30 | 40
  interface ItemProps {
    /** 主播ID */
    anchorId: number
    memberId: number
    /** 主播身份 10-公司, 20-供应商, 30-网红主播, 40-买家 */
    anchorIdentityType: AnchorIdentityType
    /** 主播等级(0-普通主播, 10-星级主播) */
    anchorLevel: 0 | 10
    nickName: string
    /** 是否是黑名单(0-不是，1-是) 默认为0 */
    status: 0 | 1
    headUrl: string
    phone: string
    /** 1.喜团优选 2.喜团买菜 */
    bizScopes: any

  }
}