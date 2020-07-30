import React from 'react'
import GoodCell from '@/components/good-cell'
import SuppilerSelect from '@/components/suppiler-auto-select'
import refundType from '@/enum/refundType'
import createType from '@/enum/createType'
import { Button } from 'antd'
import MoneyRender from '@/components/money-render'
import { formatDate } from '@/pages/helper'
import SelectFetch from '@/components/select-fetch'
import {
  getShopTypes
} from '../api'
export const namespace = 'refundOrder'

export const refundStatusOptions: any = {
  ALL: [ // 所有售后订单
    { key: 10, val: '待客服审核' },
    { key: 15, val: '待商家审核' },
    { key: 20, val: '待用户发货' },
    { key: 21, val: '退款失败' },
    { key: 23, val: '退款中' },
    { key: 24, val: '待商家收货' },
    { key: 25, val: '待商家发货' },
    { key: 26, val: '待用户收货' },
    { key: 27, val: '等待客服跟进' },
    { key: 30, val: '售后完成' },
    { key: 40, val: '售后关闭' }
  ],
  WAITCONFIRM: [{ key: 10, val: '待客服审核' },{ key: 15, val: '待商家审核' }], // 待审核
  OPERATING: [ // 处理中
    { key: '', val: '全部' },
    { key: 20, val: '待用户发货' },
    { key: 21, val: '退款失败' },
    { key: 23, val: '退款中' },
    { key: 24, val: '待商家收货' },
    { key: 25, val: '待商家发货' },
    { key: 26, val: '待用户收货' },
    { key: 27, val: '等待客服跟进' }
  ],
  COMPLETE: [{ key: 30, val: '售后完成' }], // 已完成
  REJECTED: [{ key: 40, val: '售后关闭' }] // 已关闭
}

export const typeMapRefundStatus = {
  ALL: null,
  WAITCONFIRM: [10, 15],
  OPERATING: [20, 21, 23, 24, 25, 26, 27],
  COMPLETE: [30],
  REJECTED: [40]
}

export const formFields = function (
  refundStatus: any,
  intercept: any
) {
  const options = refundStatusOptions[refundStatus]
  const selectRefundStatus
    = options.length > 1
      ? [
        {
          type: 'select',
          id: 'refundStatus',
          label: '售后单状态',
          options: options,
          controllerProps: {
            mode: 'multiple'
          }
        }
      ]
      : []
  return [
    {
      type: 'input',
      id: 'mainOrderCode',
      label: '订单编号'
    },
    {
      type: 'input',
      id: 'orderCode',
      label: '售后单编号'
    },
    {
      type: 'select',
      id: 'refundType',
      label: '售后类型',
      options: refundType.getArray('all'),
      initialValue: ''
    },
    {
      type: 'input',
      id: 'memberPhone',
      label: '下单人电话'
    },
    {
      type: 'input',
      id: 'phone',
      label: '收货人电话'
    },
    {
      type: 'input',
      id: 'storeId',
      label: '供应商',
      render: () => <SuppilerSelect />
    },
    {
      type: 'input',
      id: 'productId',
      label: '商品ID',
      sourceProps: {
        type: 'number'
      }
    },
    {
      type: 'input',
      id: 'operator',
      label: '处理人'
    },
    {
      type: 'select',
      id: 'createType',
      label: '申请人类型',
      options: createType.getArray('all'),
      initialValue: ''
    },
    {
      type: 'date',
      id: 'apply',
      ids: ['applyStartTime', 'applyEndTime'],
      label: '申请时间'
    },
    {
      type: 'date',
      id: 'handle',
      ids: ['handleStartTime', 'handleEndTime'],
      label: '处理时间'
    },
    {
      type: 'date',
      id: 'payTime',
      ids: ['payStartTime', 'payEndTime'],
      label: '支付时间'
    },
    {
      type: 'input',
      id: 'expressCode',
      label: '物流单号'
    },
    ...selectRefundStatus,
    {
      type: 'select',
      id: 'orderType',
      label: '订单类型',
      // 必须按需加载这个模块
      options: (APP.constant.orderTypeList || [])
        .map((item) => ({
          val: item.label,
          key: item.value
        })),
      initialValue: undefined
    },
    {
      type: 'select',
      id: 'interception',
      label: '拦截订单',
      options: [
        {
          val: '全部',
          key: ''
        },
        {
          val: '拦截订单',
          key: '1'
        },
        {
          val: '非拦截订单',
          key: '0'
        }
      ],
      initialValue: ''
    },
    {
      type: 'input',
      id: 'interceptionMemberPhone',
      label: '拦截人电话'
    },
    {
      type: 'select',
      id: 'storeType',
      label: '供应商类型',
      options: [
        {
          val: '喜团',
          key: 0
        },
        {
          val: '1688',
          key: 1
        },
        {
          val: '淘宝联盟',
          key: 2
        },
        {
          val: '一般海外供应商',
          key: 3
        },
        {
          val: '保税仓海外供应商',
          key: 4
        }
      ],
      config: {
        initialValue: undefined
      }
    },
    {
      type: 'select',
      id: 'autoAudit',
      label: '是否自动审核',
      options: [
        {
          val: '全部',
          key: ''
        },
        {
          val: '是',
          key: 1
        },
        {
          val: '否',
          key: 0
        }
      ],
      initialValue: ''
    }, {
      type: 'input',
      id: 'shopPhone',
      sourceProps: {
        placeholder: '只支持小店和pop店'
      },
      label: '供应商手机'
    },
    {
      type: 'select',
      id: 'deliveryMode',
      label: '发货方式',
      options: [
        {
          val: '仓库发货',
          key: 1
        },
        {
          val: '供货商发货',
          key: 2
        },
        {
          val: '其他',
          key: 3
        }
      ]
    },
    {
      type: 'input',
      id: 'shopType',
      label: '店铺类型',
      render: () => {
        return (<SelectFetch
          mode='multiple'
          placeholder= '请选择店铺类型'
          style={{ width: 180 }}
          fetchData={getShopTypes}
        />)
      }
    }
  ].filter((item: any) => {
    return intercept
      ? item.id !== 'interception'
        && item.id !== 'interceptionMemberPhone'
      : true
  })
}

/**
 * 列表属性
 * @param {*} param
 */
export const getListColumns = ({ query, history }: any) => [
  {
    title: '商品ID',
    dataIndex: 'productId'
  },
  {
    title: '商品',
    dataIndex: 'skuName',
    render (skuName: any, row: any) {
      return (
        <GoodCell {...row} showImage={false} isRefund />
      )
    }
  },
  {
    title: '售后状态',
    dataIndex: 'refundStatusStr'
  },
  {
    title: '售后类型',
    dataIndex: 'refundTypeStr'
  },
  {
    title: '申请售后数目',
    dataIndex: 'serverNum'
  },
  {
    title: '申请售后金额',
    dataIndex: 'amount',
    render: MoneyRender
  },
  {
    title: '供应商',
    dataIndex: 'storeName'
  },
  {
    title: '买家信息',
    dataIndex: 'userName',
    render (v: any, record: any) {
      return `${v ? v : ''} ${record.phone
        ? `(${record.phone})`
        : ''}`
    }
  },
  {
    title: '处理人',
    dataIndex: 'operator',
    render: (text: any) => text || '-'
  },
  {
    title: '最后处理时间',
    dataIndex: 'handleTime',
    render: (text: any) => (text ? formatDate(text) : '-')
  },
  {
    title: '供应商操作',
    dataIndex: 'supplierOperate',
    render: (text: number) => {
      return text === 10 ? '同意' : '-'
    }
  },
  {
    title: '操作',
    dataIndex: 'record',
    render: (_: any, { id }: any) => (
      <Button
        type='primary'
        onClick={() =>
          history.push(`/order/refundOrder/${id}`)}
      >
        查看详情
      </Button>
    )
  }
]

export const logisticsInformationColumns = [
  {
    title: '物流公司',
    dataIndex: 'expressName',
    key: 'expressName'
  },
  {
    title: '物流单号',
    dataIndex: 'expressCode',
    key: 'expressCode'
  }
]
export const getDetailColumns = () => [
  {
    title: '名称',
    dataIndex: 'skuName',
    key: 'skuName'
  },
  {
    title: '属性',
    dataIndex: 'properties',
    key: 'properties'
  },
  {
    title: '单价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: MoneyRender
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: '商品总价（元）',
    dataIndex: 'saleTotalPrice',
    key: 'saleTotalPrice',
    render: MoneyRender
  },
  {
    title: '优惠券',
    dataIndex: 'faceValue',
    key: 'faceValue'
  },
  {
    title: '应付金额',
    dataIndex: 'dealTotalPrice',
    key: 'dealTotalPrice',
    render: MoneyRender
  },
  {
    title: '优惠金额',
    dataIndex: 'discountPrice',
    key: 'discountPrice',
    render: MoneyRender
  },
  {
    title: '实付金额',
    dataIndex: 'preferentialTotalPrice',
    key: 'preferentialTotalPrice',
    render: MoneyRender
  }
]

export const refundTypes = refundType.getArray()

export const storeTypeMap = {
  1: '喜团自营店',
  2: '直播小店',
  3: '品牌旗舰店',
  4: '品牌专营店',
  5: '喜团工厂店',
  6: '普通企业店'
}