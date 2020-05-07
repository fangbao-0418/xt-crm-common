/*
 * @Date: 2020-05-06 14:16:27
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-07 10:22:58
 * @FilePath: /xt-crm/src/components/good-cell/index.js
 */
import React from 'react'
import Image from '@/components/Image'
import './index.scss'

const GoodCell = (props) => {
  const { productImage, skuName, properties, coverUrl, showImage = true, orderType, refundType, isRefund } = props
  const isGive = isRefund ? false : String(orderType) === '50'
  return (
    <div>
      {
        showImage && (
          <div style={{ float: 'left' }}>
            <Image
              alt={'商品图片'}
              src={(coverUrl || productImage)}
              style={{ maxHeight: 100, maxWidth: 100 }}
            />
          </div>
        )
      }
      <div style={showImage?{ marginLeft: 116 } : { marginLeft: 0, textAlign: 'left' }}>
        <div>
          {isGive && (
            <span style={{ border: '1px solid red', fontSize: 12, color: 'red', padding: '0 2px', margin: '0 2px' }}>
              赠
            </span>
          )}
          {skuName}
        </div>
        <div style={{ marginTop: 8 }}>{properties ? `${properties}` : ''}</div>
      </div>
    </div>
  )
}

export default GoodCell
