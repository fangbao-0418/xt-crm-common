import React from 'react'
interface Props {
  onChange?: any
  placeholder?: string
  listType?: 'text' | 'picture' | 'picture-card'
  listNum?: number
  size?: number
  showUploadList?: booelan
  pxSize?: {width: number, height: number}[]
  fileType?: string | string[]
  /** 上传文件格式提示文案 */
  fileTypeText?: string
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
  formatOrigin?: boolean
}
export declare const ossUpload: (file: File) => Promise<any>
export function formatValue (value: any[]): string
class Upload extends React.Component<Props> {}
export default Upload