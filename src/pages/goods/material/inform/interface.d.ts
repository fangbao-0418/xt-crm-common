export interface ReplyInfoProps {
  id: number
  materialId: number
  content: string
  memberId: number
  headImage: string
  nickName: string
  status: number
  createTime: number
  /** 0 未删除 1 已删除 */
  isDelete: 0 | 1
}
// 1. 举报成功 2 举报无效
export interface RecordProps {
  id: number
  description: string
  imageUrls: string[]
  /** 举报类型 1 广告内容 2 不友善内容 3 造谣传谣 4 违法违规 5 色情低俗 6 其他 */
  type: 1 | 2 | 3 | 4 | 5 | 6
  /** reportId */
  reportId: number
  /** 素材ID */
  materialId: number
  /** 1. 待审核 2. 举报成功 3 举报失败 */
  status: 1 | 2 | 3
  /** 操作人 */
  operateId: number
  /** 0 未删除 1 已删除 */
  isDelete: 0 | 1
  createTime: number
  modifyTime: number
  productId: number
  replyInfo: ReplyInfoProps
  productName: string
  /** 1. 举报成功 2 举报无效 */
  reportResult: '1' | '2'
  feedbackWord: string
  reportUserId: number
}