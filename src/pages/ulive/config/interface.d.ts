/** 直播标签 */
interface TagItem {
  id: number
  /** 删除状态(0-不删除，1-删除, 2-删除中) */
  isDelete: 0 | 1
  /** 直播中的场次 */
  livingTatol: number
  sort: number
  /** 标签名称 */
  title: string
  /** 预告中的场次 */
  trailerTatol: number
}