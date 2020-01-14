import React from 'react'
interface Props {
  onChange?: any
  placeholder?: string
  listType: 'text' | 'picture' | 'picture-card'
  listNum?: number
  size?: number
  showUploadList?: booelan
  pxSize?: {width: number, height: number}[]
  fileType?: string
  disabled?: boolean
  multiple?: boolean
  value?: {url: string, uid?: any}[]
  className?: string
  accept?: string
  style?: React.CSSProperties
  /** 是否格式化掉域名，即去掉cdn域名，默认false 不去掉域名部分 */
  formatOrigin?: boolean
}
export declare const ossUpload: (file: File) => Promise<any>

class Upload extends React.Component<Props> {}
export default Upload