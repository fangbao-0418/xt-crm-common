/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-28 17:23:09
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/components/Image/index.d.ts
 */
import React from 'react'
interface Props {
  className?: string
  src: string | undefined
  style?: React.CSSProperties
  alt?: string
  title?: string
  width?: string | number
  height?: string | number
  onClick?: () => void
}
export default (props: Props) => React.ReactNode