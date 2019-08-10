import React, { Component } from 'react';
import GoodCell from '../../../components/good-cell';
import RemarkModal from '../components/remark-modal';
import RefundModal from '../components/refund-modal';
import { formatMoneyWithSign } from '@/pages/helper';
import { dateFormat } from '@/util/utils';
import { enumRefundStatus } from '../constant';
import refundType from '@/enum/refundType';
import createType from '@/enum/createType';
import moment from 'moment';
import { Button } from 'antd';
export const formFields = function () {
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
      id: 'orderPhone',
      label: '下单人电话'
    }, {
      type: 'input',
      id: 'phone',
      label: '收货人电话'
    }, {
      type: 'input',
      id: 'storeId',
      label: '供应商'
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
      label: '售后时间'
    }, {
      type: 'date',
      id: 'handle',
      ids: ['handleStartTime', 'handleEndTime'],
      label: '处理时间'
    }
  ];
}

/**
 * 列表属性
 * @param {*} param0 
 */
export const getListColumns = ({ query, history }) => [
  {
    title: '商品名称',
    dataIndex: 'skuName',
    render(skuName, row) {
      return <GoodCell {...row} />;
    },
  },
  {
    title: '商品单价',
    dataIndex: 'salePrice',
    render(salePrice) {
      return salePrice ? formatMoneyWithSign(salePrice) : '';
    },
  },
  {
    title: '商品数量',
    dataIndex: 'num',
  },
  {
    title: '售后单编号',
    dataIndex: 'orderCode',
  },
  {
    title: '订单编号',
    dataIndex: 'mainOrderCode',
  },
  {
    title: '供应商',
    dataIndex: 'storeName',
  },
  {
    title: '买家 (手机号)',
    dataIndex: 'userName',
    render(v, record) {
      return `${v ? v : ''} ${record.phone ? `(${record.phone})` : ''}`
    }
  },
  {
    title: '类型',
    dataIndex: 'refundTypeStr',
  },
  {
    title: '退款状态',
    dataIndex: 'refundStatusStr',
  },
  {
    title: '实付金额（元）',
    dataIndex: 'buyPrice',
    render(v) {
      return v ? formatMoneyWithSign(v) : ''
    }
  },
  {
    title: '售后时间',
    dataIndex: 'createTime',
    render(v) {
      return v && moment(v).format(dateFormat)
    }
  },
  {
    title: '处理人',
    dataIndex: 'operator'
  },
  {
    title: '操作',
    dataIndex: 'record',
    render: (_, { id, skuId, refundId, childOrderId, mainOrderCode, orderCode, refundStatus, isDelete }) => {
      return (
        <div style={{ display: 'flex' }}>
          <RemarkModal
            onSuccess={query}
            orderCode={mainOrderCode}
            refundId={refundId}
            childOrderId={childOrderId}
          />
          &nbsp;
        {[enumRefundStatus.Complete, enumRefundStatus.Rejected].includes( // 已完成，已取消（isDelete === 1），已驳回的展示查看
            Number(refundStatus)
          ) || isDelete === 1 ? (
              // <RefundModal
              //   onSuccess={query}
              //   orderCode={orderCode}
              //   refundId={refundId}
              //   childOrderId={childOrderId}
              //   skuId={skuId}
              //   id={id}
              //   readOnly={true}
              // />
              <Button type="primary" onClick={() => history.push(`/order/refundOrder/${id}`)}>查看</Button>
            ) :
            //  <RefundModal
            //   onSuccess={query}
            //   orderCode={orderCode}
            //   refundId={refundId}
            //   childOrderId={childOrderId}
            //   skuId={skuId}
            //   id={id}
            // />
            <Button type="primary" onClick={() => history.push(`/order/refundOrder/${id}`)}>审核</Button>
          }
        </div>
      );
    },
  },
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
  },
  {
    title: '实付金额',
    dataIndex: 'dealTotalPrice',
    key: 'dealTotalPrice',
  }
];

export const expressColumns = [{
  title: '物流公司',
  dataIndex: 'expressName',
  key: 'expressName',
}, {
  title: '物流单号',
  dataIndex: 'expressCode',
  key: 'expressCode',
}]

export const refundTypes = refundType.getArray()

export const logColumns = [{
  title: '前操作状态',
  dataIndex: '',
  key: ''
}, {
  title: '后操作状态',
  dataIndex: '',
  key: ''
}, {
  title: '操作时间',
  dataIndex: '',
  key: ''
}, {
  title: '备注',
  dataIndex: '',
  key: ''
}, {
  title: '操作人',
  dataIndex: '',
  key: ''
}]