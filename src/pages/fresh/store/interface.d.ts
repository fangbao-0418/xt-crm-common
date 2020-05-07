/*
 * @Date: 2020-04-13 15:28:04
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 17:04:46
 * @FilePath: /xt-crm/src/pages/fresh/store/interface.d.ts
 */

export interface RecordProps {
  /** 未知 -1, 新建 = 1, 上线 = 2, 下线 = 3, 待审核 = 4, 驳回 = 5 */
  status: -1 | 1 | 2 | 3 | 4 | 5
  /** 门店编号 */
  code: string
  /** 邀请人姓名 */
  inviteShopName: string
  /** 邀请人手机号 */
  inviteShopPhone: string
}