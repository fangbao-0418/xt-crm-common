/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 17:31:34
 * @FilePath: /xt-crm/src/pages/coupon/action-btn-group/index.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Message, Modal, Menu, Dropdown, Button, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import emitter from '@/util/events'
import { overReciveCoupon } from '../api'
import './index.scss'
const coupons = {
  '0': ['ISSUE_COUPON', 'VIEW', 'EDIT', 'FINISH', 'COPY'],
  '1': ['ISSUE_COUPON', 'VIEW', 'EDIT', 'FINISH', 'COPY'],
  '2': ['VIEW', 'COPY']
}

function ActionBtn ({ keyCode, history, record, match }) {
  const openQrCode = () => {
    emitter.emit('coupon.list.setVisible', { visible: true, id: record.id })
  }
  const menu = (
    <Menu>
      {record.receivePattern !== 1 && (
        <Menu.Item>
          <span onClick={openQrCode}>二维码</span>
        </Menu.Item>
      )}
      <Menu.Item>
        <span onClick={() => history.push({
          pathname: `/coupon/get/couponList/bulkissuing/${record.id}`,
          search: `name=${record.name}`
        })}>
          批量发券
        </span>
      </Menu.Item>
    </Menu>
  )
  const handleFinish = () => {
    Modal.confirm({
      title: '系统提示',
      content: '结束优惠券发放，已领取优惠券可以继续使用，是否结束？',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const res = await overReciveCoupon(record.id)
        if (res) {
          Message.success('结束优惠券发放成功')
          emitter.emit('coupon.list.fetchData')
        }
      }
    })
  }

  const handleCopy = () => {
    console.log('record =>', record)
    APP.history.push(`/coupon/get/couponList/couponinfo?type=add&id=${record.id}`)
  }

  switch (keyCode) {
    case 'ISSUE_COUPON':
      return (
        <Dropdown type='link' overlay={menu}>
          <span className='href mr8'>
            发券 <Icon type='down' />
          </span>
        </Dropdown>
      )
    case 'VIEW':
      return <span className='href mr8' onClick={() => history.push({ pathname: `${match.url}/detail/${record.id}` })}>查看</span>
    case 'EDIT':
      return (
        <span className='href mr8' onClick={() => history.push({
          pathname: `${match.url}/couponedit`,
          search: `type=edit&id=${record.id}`
        })}>
          编辑
        </span>
      )
    case 'FINISH':
      return <span className='href mr8' onClick={handleFinish}>结束</span>
    case 'COPY':
      return <span className='href mr8' onClick={handleCopy}>复制</span>
    default:
      return null
  }
}

ActionBtn.propTypes = {
  keyCode: PropTypes.any,
  history: PropTypes.object,
  record: PropTypes.object,
  match: PropTypes.object
}

const WithActionBtn = withRouter(ActionBtn)
function ActionBtnGroup ({ record }) {
  return (
    <div className='action-btn-group'>
      {
        Array.isArray(coupons[record.status])
          ? coupons[record.status].map(v => <WithActionBtn key={v} keyCode={v} record={record} />)
          : null
      }
    </div>
  )
}
ActionBtnGroup.propTypes = {
  record: PropTypes.object
}

export default ActionBtnGroup