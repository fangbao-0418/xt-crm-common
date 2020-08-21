import React from 'react'
import UserView from './components/userView'
import If from '@/packages/common/components/if'
import { formatMoney } from '@/pages/helper'
import { shopStatusMap, auditTypeMap } from './config'

// 审核通过
export const getPassColums = ({ onDetail, onUserClick, onClose, onOpen }) => {
  return [
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      render: val => val || '-'
    },
    {
      title: '管理员',
      dataIndex: 'user',
      key: 'user',
      render: (val, record) => {
        let src = ''
        if (record.headUrl) {
          src = record.headUrl.indexOf('http') === 0 ? `${record.headUrl}` : `https://assets.hzxituan.com/${record.headUrl}`
        }

        return (<UserView
          onClick={onUserClick.bind(null, record)}
          title={record.nickName}
          desc={record.memberId}
          avatar={src}
        />)
      }
    },
    {
      title: '供应商ID',
      dataIndex: 'supplierId'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '成交额|退款',
      render: (_, record) => {
        return formatMoney(record.amount) + '|' + formatMoney(record.refundAmount)
      }
    },
    {
      title: '在售商品数',
      dataIndex: 'sellPorductNum',
      key: 'sellPorductNum'
    },
    {
      title: '商品违规次数(累计|近30天)',
      dataIndex: 'violation',
      key: 'violation',
      render: (val, record) => {
        return record.illegalTotalNum + ' | ' + record.illegalThirtyNum
      }
    },
    {
      title: '状态',
      dataIndex: 'shopStatus',
      key: 'shopStatus',
      render: val => shopStatusMap[val]
    },
    {
      title: '店铺类型',
      dataIndex: 'tag',
      key: 'tag',
      render: val => val || '-'
    },
    {
      title: '主营类目',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: val => val || '-'
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
          <div>
            <If condition={record.shopType !== 2}>
              <div onClick={onDetail.bind(null, record)} className='href'>查看资质</div>
            </If>
            <If condition={record.shopStatus === 2}>
              <div onClick={onClose.bind(null, record)} className='href'>关闭店铺</div>
            </If>
            <If condition={record.shopStatus === 3 || record.shopStatus === 1}>
              <div onClick={onOpen.bind(null, record)} className='href'>开启店铺</div>
            </If>
          </div >
        )
      }
    }
  ]
}

// 待审核
export const getCheckColums = ({ onDetail, onUserClick, onPass, onNoPass }) => {
  return [
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      render: val => val || '-'
    },
    {
      title: '管理员',
      dataIndex: 'user',
      key: 'user',
      render: (val, record) => {
        let src = ''
        if (record.headUrl) {
          src = record.headUrl.indexOf('http') === 0 ? `${record.headUrl}` : `https://assets.hzxituan.com/${record.headUrl}`
        }

        return (<UserView
          onClick={onUserClick.bind(null, record)}
          title={record.nickName}
          desc={record.memberId}
          avatar={src}
        />)
      }
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '状态',
      dataIndex: 'auditType',
      key: 'auditType',
      render: val => auditTypeMap[val]
    },
    {
      title: '店铺类型',
      dataIndex: 'tag',
      key: 'tag',
      render: val => val || '-'
    },
    {
      title: '主营类目',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: val => val || '-'
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
          <div>
            <If condition={record.shopType !== 2}>
              <span onClick={onDetail.bind(null, record)} className='href mr8'>查看资质</span>
            </If>
            <span onClick={onPass.bind(null, record)} className='href mr8'>通过</span>
            <span onClick={onNoPass.bind(null, record)} className='href'>不通过</span>
          </div >
        )
      }
    }
  ]
}

// 不通过
export const getNoPassColums = ({ onDetail, onUserClick }) => {
  return [
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      render: val => val || '-'
    },
    {
      title: '管理员',
      dataIndex: 'user',
      key: 'user',
      render: (val, record) => {
        let src = ''
        if (record.headUrl) {
          src = record.headUrl.indexOf('http') === 0 ? `${record.headUrl}` : `https://assets.hzxituan.com/${record.headUrl}`
        }

        return (<UserView
          onClick={onUserClick.bind(null, record)}
          title={record.nickName}
          desc={record.memberId}
          avatar={src}
        />)
      }
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: '状态',
      dataIndex: 'auditType',
      key: 'auditType',
      render: val => auditTypeMap[val]
    },
    {
      title: '店铺类型',
      dataIndex: 'tag',
      key: 'tag',
      render: val => val || '-'
    },
    {
      title: '主营类目',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: val => val || '-'
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
          <div>
            <If condition={record.shopType !== 2}>
              <span onClick={onDetail.bind(null, record)} className='href mr8'>查看资质</span>
            </If>
            <If condition={record.shopType === 2}>
              <span>暂无操作</span>
            </If>
          </div >
        )
      }
    }
  ]
}