import React from 'react'
import { Popconfirm} from 'antd'
import ListPage from '@/packages/common/components/list-page'
import { getDefaultConfig } from './config'
import { getPurchaseDetail } from './api'
class Main extends React.Component {
  public columns = [
    {
      title: '采购批次',
      key: 'purchaseNo',
      dataIndex: 'purchaseNo'
    },
    {
      title: '采购时间',
      key: 'purchaseTime',
      dataIndex: 'purchaseTime'
    },
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId'
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName'
    },
    {
      title: '供货成本',
      key: 'purchasePrice',
      dataIndex: 'purchasePrice'
    },
    {
      title: '库存',
      key: 'stock',
      dataIndex: 'stock'
    },
    {
      title: 'sku名称',
      key: 'skuName',
      dataIndex: 'skuName'
    },
    {
      title: '团长价',
      key: 'headPrice',
      dataIndex: 'headPrice'
    },
    {
      title: '区长价',
      key: 'cityPrice',
      dataIndex: 'cityPrice'
    },
    {
      title: '合伙人价',
      key: 'areaPrice',
      dataIndex: 'areaPrice'
    },
    {
      title: '管理员价',
      key: 'managerPrice',
      dataIndex: 'managerPrice'
    },
    {
      title: '最后操作者',
      key: 'lastModifyName',
      dataIndex: 'lastModifyName'
    },
    {
      title: '操作',
      key: 'operate',
      width: 80,
      fixed: 'right',
      render: (text: any, records: any) => {
        return (
          <Popconfirm
            title='确认核销该采购批次？'
            onConfirm={() => {}}
            onCancel={() => {}}
            okText='确认'
            cancelText='取消'
          >
            <span className='href'>核销</span>
          </Popconfirm>
        )
      }
    }
  ]
  public render () {
    return (
      <ListPage
        rangeMap={{
          pruchaseTime: {
            fields: ['pruchaseStartTime', 'purchaseEndTime']
          }
        }}
        formConfig={getDefaultConfig()}
        columns={this.columns}
        api={getPurchaseDetail}
      />
    )
  }
}

export default Main