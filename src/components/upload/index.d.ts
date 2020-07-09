import React from 'react'
interface Props {
  onChange?: any
  placeholder?: string
  listType?: 'text' | 'picture' | 'picture-card'
  listNum?: number
  size?: number
  showUploadList?: booelan
  /** 支持的扩展名 多个,分割 */
  extname?: string
  pxSize?: {width: number, height: number}[]
  fileType?: string | string[]
  /** 上传文件格式提示文案 */
  fileTypeErrorText?: string
  disabled?: boolean
  multiple?: boolean
  value?: {
    url: string,
    uid?: any,
    /** 文件相对地址 */
    rurl?: string
  }[]
  className?: string
  accept?: string
  style?: React.CSSProperties
  /** 是否格式化掉域名，即去掉cdn域名，默认false 不去掉域名部分 */
  formatOrigin?: boolean,
  ossDir?: string /** oss 上传指定目录 */
  ossType?: 'cos' | 'oss' /** 使用oss的类型  oss: 阿里云， cos: 腾讯云 */
}
/**
 * file: 上传文件对象
 * path: dir业务目录
 * ossType: 服务器类型cos腾讯云 oss阿里云
 * specifiedAddress: 指定上传地址的目录(类似客服中心，前端自己靠维护服务器某json文件进行数据更新，脱离后端开发的一种方案)
*/
export declare const ossUpload: (file: File, dir?: string, ossType?: string, specifiedAddress?: string) => Promise<any>
export function formatValue (value: any[]): string
class Upload extends React.Component<Props> {}
export default Upload