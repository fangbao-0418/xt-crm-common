import React, { Fragment } from 'react';
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
      render: (text, record) => {
        const {settId} = record
        return <Button 
          type='link'
          href={window.location.pathname + `#/merchant-accounts/checking/${settId}`}
          target='_blank'
        >{text}</Button>
      }
    },
    {
      title: '金额',
      key: 'paymentMoney',
      dataIndex: 'paymentMoney',
      render: MoneyRender
    },
    {
      title: '商家名称',
      key: 'storeName',
      dataIndex: 'storeName',
    },
    {
      title: '商家类型',
      key: 'storeTypeInfo',
      dataIndex: 'storeTypeInfo',
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
      render: (createTime) => APP.fn.formatDate(createTime) || '-'
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
      render: (modifyTime) => APP.fn.formatDate(modifyTime) || '-'

    },
    {
      title: '操作人',
      key: 'modifyName',
      dataIndex: 'modifyName',
      render: val => val || '-'
    },
    {
      title: '操作',
      width: '150px',
      align: 'center',
      render: (operate, record) => {
        if (enumPayType.ToBePaid === record.paymentStatus) {
          return (
            <Fragment>
              <Button type="primary" onClick={onConfirm(record, 'confirm')}>
                确认支付
              </Button><br />
              <Button className="mt10" onClick={onConfirm(record, 'fail')}>
                支付失败
              </Button>
            </Fragment>
          )
        } else if (enumPayType.Freezing === record.paymentStatus) {
          return (
            <Button type="primary" disabled>
              确认支付
            </Button>
          )
        } else if (enumPayType.Paid === record.paymentStatus) {
          return (
            <Fragment>
              <Button type="link" onClick={onConfirm(record, 'look')}>
                查看明细
              </Button>
              <Button type="link" onClick={onConfirm(record, 'lookupload')}>
                上传凭证
              </Button>
            </Fragment>

          )
        } else if (enumPayType.Fail === record.paymentStatus) {
          return (
            <Button type="primary" onClick={onConfirm(record, 'confirm')}>
              重新支付
            </Button>
          )
        } else {
          return null
        }
      }
    }
  ];
}

export default getColumns