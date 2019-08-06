import React, { Component } from 'react';
import GoodCell from '../../../components/good-cell';
import RemarkModal from '../components/remark-modal';
import RefundModal from '../components/refund-modal';
import { formatMoneyWithSign } from '@/pages/helper';
import { dateFormat } from '@/util/utils';
import { enumRefundStatus } from '../constant';
import refundType from '@/enum/refundType';
import moment from 'moment';
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
    //  placeholder: '请',
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
      id: 'handler',
      label: '处理人'
    }, {
      type: 'date',
      id: 'apply',
      ids: ['applyStartTime', 'applyEndTime'],
      label: '售后时间'
    }
  ];
}

/**
 * 列表属性
 * @param {*} param0 
 */
export const columns = function ({ query }) {
  return [
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
                <RefundModal
                  onSuccess={query}
                  orderCode={orderCode}
                  refundId={refundId}
                  childOrderId={childOrderId}
                  skuId={skuId}
                  id={id}
                  readOnly={true}
                />
              ) : <RefundModal
                onSuccess={query}
                orderCode={orderCode}
                refundId={refundId}
                childOrderId={childOrderId}
                skuId={skuId}
                id={id}
              />}
          </div>
        );
      },
    },
  ]
};
