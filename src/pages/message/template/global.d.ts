/** 消息模板 */
declare namespace MessageTemplate {
  interface ItemProps {
    id: number
    status: any
    /** 模板类型 */
    type: any
    createTime: number
    /** 模板标题 */
    templateTitle: string
    /** 模板内容 */
    templateContent: string
    /** 调整链接 */
    jumpUrl: string
    /** 模板编码 */
    businessGroup: string
    /** 模板分类 */
    messageGroup: string
  }
}