export interface ReplyInfoProps {
  id: number
  materialId: number
  content: string
  memberId: number
  headImage: string
  nickName: string
  /** 1. 正常 2 已删除 */
  status: 1 | 2
  createTime: number
  /** 0 未删除 1 已删除 */
  isDelete: 0 | 1
}
