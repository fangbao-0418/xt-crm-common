/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 17:31:34
 * @FilePath: /xt-crm/src/pages/coupon/action-btn-group/index.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

function ActionBtnGroup ({ record }) {
  return (
    <div className='action-btn-group'>
      <span
        className='href mr8'
        onClick={() => {
          APP.history.push(`/shop/pop-coupon/detail/${record.id}?code=${record.code}`)
        }}
      >
          查看
      </span>
    </div>
  )
}
ActionBtnGroup.propTypes = {
  record: PropTypes.object
}

export default ActionBtnGroup