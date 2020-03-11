import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import MoneyRender from '@/components/money-render'
import { enumSettleType } from '../../constant'

const getColumns = ({ onSettle, onReject, onPay }) => {
  return [
    {
      title: '结算单ID',
      dataIndex: 'serialNo',
      key: 'serialNo',
      width: 150
    },
    {
      title: '本期结算对账单金额',
      dataIndex: 'settlementMoney',
      key: 'settlementMoney',
      render: MoneyRender,
      width: 150

    },
    {
      title: '供应商',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 150

    },
    {
      title: '结算方式',
      dataIndex: 'payType',
      key: 'payType',
      width: 150

    },
    {
      title: '收款账户',
      dataIndex: 'accountInfo',
      key: 'accountInfo',
      width: 150,
      render: accountInfo => {
        return (
          <div>
            <p>{accountInfo.accountName}</p>
            <p>{accountInfo.accountNo}</p>
            <p>{accountInfo.bankName}</p>
          </div>
        )
      }
    },
    {
      title: '币种',
      dataIndex: 'currencyInfo',
      key: 'currencyInfo',
      width: 150

    },
    {
      title: '发票',
      dataIndex: 'invoiceInfo',
      width: 150

    },
    {
      title: '状态',
      dataIndex: 'settStatusInfo',
      key: 'settStatusInfo',
      width: 150
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      key: 'createName',
      width: 150

    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,

      render: (createTime) => {
        return APP.fn.formatDate(createTime)
      }
    },
    {
      title: '操作人',
      dataIndex: 'modifyName',
      key: 'modifyName',
      width: 150

    },
    {
      title: '操作时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      width: 200,

      render: (modifyTime) => {
        return APP.fn.formatDate(modifyTime)
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (operate, { settStatus, id, serialNo }) => (
        <>
          {
            settStatus == enumSettleType.ToBeSettled ?
              <>
                <Button type="link" onClick={onSettle(id)} style={{ padding: '0 3px' }}>提交结算</Button>
                <Button type="link" onClick={onReject(id)} style={{ padding: '0 3px' }}>驳回 </Button>
              </>
              : settStatus === enumSettleType.Settling ?
                <>
                  <Button type="link" onClick={onPay(id, serialNo)} style={{ padding: '0 3px' }}>去付款</Button>
                  <Button type="link" onClick={onReject(id)} style={{ padding: '0 3px' }}>驳回 </Button>
                </>
                : settStatus === enumSettleType.partSettled ?
                  <Button type="link" onClick={onPay(id, serialNo)} style={{ padding: '0 3px' }}>去付款</Button>
                  : null
          }
          <Button type="link" style={{ padding: '0 2px' }}>
            <Link to={`/merchant-accounts/settlement/${id}`}>查看明细</Link>
          </Button>
        </>
      )
    }
  ]
}

export default getColumns