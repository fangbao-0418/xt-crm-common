import React from 'react';
import GoodCell from '@/components/good-cell';
import SuppilerSelect from '@/components/suppiler-auto-select'
import { enumRefundStatus } from '../constant';
import refundType from '@/enum/refundType';
import createType from '@/enum/createType';
import { Button } from 'antd';
import MoneyRender from '@/components/money-render'
import { formatDate } from '@/pages/helper';

export const refundStatusOptions: any = {
  ALL: [
    { key: '', val: '全部' },
    { key: 10, val: '待审核' },
    { key: 20, val: '待用户发货' },
    { key: 21, val: '退款失败' },
    { key: 23, val: '退款中'},
    { key: 24, val: '待平台收货'},
    { key: 25, val: '待平台发货' },
    { key: 26, val: '待用户收货' },
    { key: 27, val: '等待客服跟进' },
    { key: 30, val: '售后完成' },
    { key: 40, val: '售后关闭' }
  ],
  WAITCONFIRM: [
    { key: 10, val: '待审核' }
  ],
  OPERATING: [
    { key: '', val: '全部' },
    { key: 20, val: '待用户发货' },
    { key: 21, val: '退款失败' },
    { key: 23, val: '退款中'},
    { key: 24, val: '待平台收货'},
    { key: 25, val: '待平台发货' },
    { key: 26, val: '待用户收货' },
    { key: 27, val: '等待客服跟进' },
  ],
  COMPLETE: [
    { key: 30, val: '售后完成' }
  ],
  REJECTED: [
    { key: 40, val: '售后关闭' }
  ]
}

export const typeMapRefundStatus = {
  ALL: null,
  WAITCONFIRM: [10],
  OPERATING: [20, 21, 23, 24, 25, 26, 27],
  COMPLETE: [30],
  REJECTED: [40]
}


export const formFields = function (refundStatus: any, intercept: any) {
  let options = refundStatusOptions[refundStatus];
  let selectRefundStatus = options.length > 1 ?
    [{
      type: 'select',
      id: 'refundStatus',
      label: '售后单状态',
      options: options
    }] : [];
  return [
    {
      type: 'input',
      id: 'mainOrderCode',
      label: '订单编号'
    }, {
      type: 'input',
      id: 'orderCode',
      label: '售后单编号'
    }, {
      type: 'select',
      id: 'refundType',
      label: '售后类型',
      options: refundType.getArray('all')
    }, {
      type: 'input',
      id: 'memberPhone',
      label: '下单人电话'
    }, {
      type: 'input',
      id: 'phone',
      label: '收货人电话'
    }, {
      type: 'input',
      id: 'storeId',
      label: '供应商',
      render: () => <SuppilerSelect />
    }, {
      type: 'input',
      id: 'productId',
      label: '商品ID',
      sourceProps: {
        type: 'number'
      }
    }, {
      type: 'input',
      id: 'operator',
      label: '处理人'
    }, {
      type: 'select',
      id: 'createType',
      label: '申请人类型',
      options: createType.getArray('all')
    }, {
      type: 'date',
      id: 'apply',
      ids: ['applyStartTime', 'applyEndTime'],
      label: '申请时间'
    }, {
      type: 'date',
      id: 'handle',
      ids: ['handleStartTime', 'handleEndTime'],
      label: '处理时间'
    }, {
      type: 'date',
      id: 'payTime',
      ids: ['payStartTime', 'payEndTime'],
      label: '支付时间'
    }, {
      type: 'input',
      id: 'expressCode',
      label: '物流单号'
    },
    ...selectRefundStatus,
    {
      type: 'select',
      id: 'orderType',
      label: '订单类型',
      options: [
        { val: '全部', key: '' },
        { val: '普通订单', key: '0' },
        { val: '激活码订单', key: '10' },
        { val: '地推订单', key: '20' },
        { val: '活动兑换订单', key: '30' },
        { val: '采购订单', key: '40' },
        { val: '团购会订单', key: '60' },
        { val: '海淘订单', key: '70' },
        { val: '团购会采购订单', key: '80' }
      ]
    }, {
      type: 'select',
      id: 'interception',
      label: '拦截订单',
      options: [{
        val: '全部',
        key: ''
      }, {
        val: '拦截订单',
        key: '1'
      }, {
        val: '非拦截订单',
        key: '0'
      }]
    }, {
      type: 'input',
      id: 'interceptionMemberPhone',
      label: '拦截人电话'
    }
  ].filter((item: any) => {
    return intercept ? (item.id !== 'interception' && item.id !== 'interceptionMemberPhone') : true;
  })
}

/**
 * 列表属性
 * @param {*} param0 
 */
export const getListColumns = ({ query, history }: any) => [
  {
    title: '商品ID',
    dataIndex: 'productId'
  },
  {
    title: '商品',
    dataIndex: 'skuName',
    render(skuName: any, row: any) {
      return <GoodCell {...row} showImage={false} isRefund />;
    },
  },
  {
    title: '售后状态',
    dataIndex: 'refundStatusStr',
  },
  {
    title: '售后类型',
    dataIndex: 'refundTypeStr',
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
    dataIndex: 'storeName',
  },
  {
    title: '买家信息',
    dataIndex: 'userName',
    render(v: any, record: any) {
      return `${v ? v : ''} ${record.phone ? `(${record.phone})` : ''}`
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
    render: (text: any) => text ? formatDate(text) : '-'
  },
  {
    title: '供应商操作',
    dataIndex: 'supplierOperate',
    render: (text: number) => {
      return text === 10 ? '同意' : '-';
    }
  },
  {
    title: '操作',
    dataIndex: 'record',
    render: (_: any, { id }: any) => <Button type="primary" onClick={() => history.push(`/order/refundOrder/${id}`)}>查看详情</Button>
  },
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
    key: 'properties',
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
    key: 'quantity',
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
];

export const refundTypes = refundType.getArray()