import React from 'react';
import GoodCell from '@/components/good-cell';
import SuppilerSelect from '@/components/suppiler-auto-select'
import { enumRefundStatus } from '../constant';
import refundType from '@/enum/refundType';
import createType from '@/enum/createType';
import { Button } from 'antd';
import MoneyRender from '@/components/money-render'
import { formatDate } from '@/pages/helper';

const OrderRefundStatusEnums = {
  NOT_REFUND: {
    value: 0,
    description: '无售后',
    cDescription: '无售后'
  },
  TO_BE_AUDIT: {
    value: 10,
    description: '待审核',
    cDescription: '待审核'
  },
  TO_BE_C_SEND: {
    value: 20,
    description: '待用户发货',
    cDescription: '处理中'
  },
  REFUND_MONEY_FAILURE: {
    value: 21,
    description: '退款失败',
    cDescription: '处理中'
  },
  REFUND_MONEY_OF: {
    value: 23,
    description: '退款中',
    cDescription: '处理中'
  },
  TO_BE_B_RECEIVE: {
    value: 24,
    description: '待平台收货',
    cDescription: '处理中'
  },
  TO_BE_B_SEND: {
    value: 25,
    description: '待平台发货',
    cDescription: '处理中'
  },
  TO_BE_C_RECEIVE: {
    value: 26,
    description: '待用户收货',
    cDescription: '处理中'
  },
  TO_BE_B_FOLLOW: {
    value: 27,
    description: '等待客服跟进',
    cDescription: '处理中'
  },
  FINISH: {
    value: 30,
    description: '完成',
    cDescription: '售后完成'
  },
  REJECT: {
    value: 40,
    description: '关闭',
    cDescription: '售后关闭'
  }
}

const filterAndMapRefundOrder = (cDescription: any) => Object.values(OrderRefundStatusEnums).filter(v => v.cDescription === cDescription).map(v => ({ key: v.value, val: v.description }));
const waitConfirm = filterAndMapRefundOrder('待审核');
const operating = filterAndMapRefundOrder('处理中');
const complete = filterAndMapRefundOrder('售后完成');
const rejected = filterAndMapRefundOrder('售后关闭');
export const orderRefundStatus: any = {
  [enumRefundStatus.All]: [{ key: '', val: '全部' }, ...waitConfirm, ...operating, ...complete, ...rejected],
  [enumRefundStatus.WaitConfirm]: waitConfirm,
  [enumRefundStatus.Operating]: operating,
  [enumRefundStatus.Complete]: complete,
  [enumRefundStatus.Rejected]: rejected
}


export const formFields = function (refundStatus: any) {
  let options = orderRefundStatus[refundStatus];
  let selectRefundStatus = options.length > 1 ? [{
    type: 'select',
    id: 'refundStatus',
    label: '售后单状态',
    options: orderRefundStatus[refundStatus]
  }] : []
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
      label: '商品ID'
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
    ...selectRefundStatus
  ];
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
      return <GoodCell {...row} showImage={false}/>;
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
      return text === 10 ? '同意': '-';
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