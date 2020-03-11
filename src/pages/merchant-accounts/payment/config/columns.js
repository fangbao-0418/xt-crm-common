import React from 'react';
import { Button } from 'antd';
import MoneyRender from '@/components/money-render'
import { enumPayType } from '../../constant'

const getColumns = ({ onConfirm }) => {
  return [
    {
      title: '付款单ID',
      key: 'paymentSerialNo',
      dataIndex: 'paymentSerialNo',
    },
    {
      title: '付款单名称',
      key: 'paymentName',
      dataIndex: 'paymentName'
    },
    {
      title: '结算单ID',
      key: 'settlementSerialNo',
      dataIndex: 'settlementSerialNo',

    },
    {
      title: '金额',
      key: 'paymentMoney',
      dataIndex: 'paymentMoney',
      render: MoneyRender
    },
    {
      title: '结算人名称',
      key: 'storeName',
      dataIndex: 'storeName',
    },
    {
      title: '结算人类型',
      key: 'storeNameType',
      dataIndex: 'storeNameType',
    },
    {
      title: '状态',
      key: 'paymentStatusInfo',
      dataIndex: 'paymentStatusInfo'
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (createTime) => APP.fn.formatDate(createTime)
    },
    {
      title: '创建人',
      key: 'createName',
      dataIndex: 'createName',
    },
    {
      title: '操作时间',
      key: 'modifyTime',
      dataIndex: 'modifyTime',
      render: (modifyTime) => APP.fn.formatDate(modifyTime)

    },
    {
      title: '操作人',
      key: 'modifyName',
      dataIndex: 'modifyName',
    },
    {
      title: '操作',
      width: '150px',
      align: 'center',
      render: (operate, record) => (
        <>
          {
            enumPayType.ToBePaid === record.paymentStatus
              ? <Button type="primary" onClick={onConfirm(record, 'confirm')}>确认支付</Button>
              : enumPayType.Freezing === record.paymentStatus
                ? <Button type="primary" disabled>确认支付</Button>
                : enumPayType.Paid === record.paymentStatus
                  ? <Button type="link" onClick={onConfirm(record, 'look')}>查看明细</Button>
                  : null
          }
        </>
      )
    }
  ];
}

export default getColumns