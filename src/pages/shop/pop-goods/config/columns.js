import React from 'react'
import Image from '@/components/Image'
import moment from 'moment'
import { Tooltip, Icon } from 'antd'
import { replaceHttpUrl } from '@/util/utils'
import { formatMoneyWithSign } from '@/pages/helper'

const ChannelEnum = {
  1: '优选',
  2: '好店'
}

function formatTime (text) {
  return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '-'
}

const getColumns = ({ onPreview, onViolation, onDetail, onLower, onPass, onUnpass }) => {
  return [
    {
      title: '商品序号',
      width: 120,
      dataIndex: 'id'
    },
    {
      title: '商品ID',
      width: 120,
      dataIndex: 'productId',
      render(text) {
        return text || '-'
      },
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      width: 120,
      render: (val, record) => {
        const color = record.imageViolationReasons === '检测正常' ? 'green' : 'red'
        return (
          <>
            <Image
              style={{
                height: 100,
                width: 100,
                minWidth: 100
              }}
              src={replaceHttpUrl(val)}
              onClick={() => onPreview(record)}
              alt='主图'
            />
            {
              record.imageViolationReasons && (
                <div style={{ color, textAlign: 'center' }}>
                  <Icon style={{ color }} type='info-circle' />{' '}
                  {record.imageViolationReasons}
                </div>
              )
            }
          </>
        )
      }
    },
    {
      title: '商品名称',
      width: 120,
      dataIndex: 'productName'
    },
    {
      title: '一级类目',
      width: 120,
      dataIndex: 'firstCategoryName',
      render: (val, record) => {
        return (
          <Tooltip title={record.combineName}>
            {val}
          </Tooltip>
        )
      }
    },
    {
      title: '供货价',
      width: 100,
      dataIndex: 'costPrice',
      render: val => formatMoneyWithSign(val)
    },
    {
      title: '售价',
      width: 100,
      dataIndex: 'salePrice',
      render: val => formatMoneyWithSign(val)
    },
    {
      title: '调整后售价',
      width: 100,
      dataIndex: 'finalSalePrice',
      render: val => formatMoneyWithSign(val)
    },
    {
      title: '供应商',
      width: 100,
      dataIndex: 'supplierName'
    },
    {
      title: '商品状态',
      width: 120,
      dataIndex: 'status',
      render: (val, record) => {
        // status 1: 上架 0 下架
        const withdrawalType = record.withdrawalType // 0: 默认值 1: 店长下架 2: 管理员下架
        const withdrawalInfo = record.withdrawalInfo // 下架说明 管理员下架才有
        const auditStatus = record.auditStatus // 商品审核 0: 待提交 1: 待审核 2: 审核通过 3: 审核不通过
        if (val === 1) {
          return '在售'
        }
        if (auditStatus === 1) {
          return '待审核'
        } else if (auditStatus === 2) {
          if (record.confirmStatus === 2) {
            return '待商家确认'
          }
          if (record.confirmStatus === 0) {
            return '待导入价格'
          }
        } else if (auditStatus === 3) {
          return '不通过'
        } else if (withdrawalType === 0) {
          return '待提交'
        } else if (withdrawalType === 1) {
          return '店长下架'
        } else if (withdrawalType === 2) {
          return (
            <Tooltip title={withdrawalInfo}>
              <span>管理员下架</span>
            </Tooltip>
          )
        } else {
          return '状态错误'
        }
      }
    },
    {
      title: '审核时间',
      width: 120,
      dataIndex: 'auditTime',
      render: (val, record) => {
        if (record.auditStatus === 1) {
          return '-'
        }
        return formatTime(val)
      }
    },
    {
      title: '审核人',
      width: 120,
      dataIndex: 'auditUser',
      render: (val, record) => {
        if (record.auditStatus === 1) {
          return '-'
        }
        return val || '-'
      }
    },
    {
      title: '违规次数',
      dataIndex: 'violationCount',
      width: 100,
      align: 'center'
    },
    {
      title: '总库存',
      dataIndex: 'usableStock',
      width: 100,
      align: 'center'
    },
    {
      title: '累计销量',
      dataIndex: 'saleCount',
      width: 100,
      align: 'center'
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      width: 100,
      align: 'center',
      render: (text) => {
        return ChannelEnum[text]
      }
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 200,
      render: (_, record) => {
        const auditStatus = record.auditStatus // 商品审核 0: 待提交 1: 待审核 2: 审核通过 3: 审核不通过
        const status = record.status
        if (status === 1) { // 上架
          return (
            <div style={{ marginTop: 40 }}>
              <span
                className='href mr8'
                onClick={() => onDetail(record, { readonly: true })}
              >
                查看
              </span>
              {record.confirmStatus === 1 && (
                <span
                  className='href mr8'
                  onClick={() => onDetail(record)}
                >
                  编辑
                </span>
              )}
              <span
                className='href'
                onClick={() => onLower(record)}
              >
                下架
              </span>
            </div>
          )
        }

        if (auditStatus === 1) {
          return (
            <div style={{ marginTop: 40 }}>
              <span
                className='href mr8'
                onClick={() => onDetail(record, { readonly: true })}
              >
                查看
              </span>
              <span
                className='href mr8'
                onClick={() => onPass(record)}
              >
                通过
              </span>
              <span
                className='href'
                onClick={() => onUnpass(record)}
              >
                不通过
              </span>
            </div>
          )
        } else {
          return (
            <div style={{ marginTop: 40 }}>
              <span
                className='href'
                onClick={() => onDetail(record, { readonly: true })}
              >
                查看
              </span>
            </div>
          )
        }
      }
    }
  ]
}

export default getColumns