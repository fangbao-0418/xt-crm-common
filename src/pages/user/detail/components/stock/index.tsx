import React from 'react'
import { Button, Popconfirm} from 'antd'
import ListPage from '@/packages/common/components/list-page'
import { getDefaultConfig } from './config'

class Main extends React.Component {
  public columns = [
    {
      title: '采购批次'
    },
    {
      title: '采购时间'
    },
    {
      title: '商品ID'
    },
    {
      title: '商品名称'
    },
    {
      title: '供货成本'
    },
    {
      title: '库存'
    },
    {
      title: 'sku名称'
    },
    {
      title: '团长价'
    },
    {
      title: '区长价'
    },
    {
      title: '合伙人价'
    },
    {
      title: '管理员价'
    },
    {
      title: '最后操作者'
    },
    {
      title: '操作',
      key: 'operate',
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
        formConfig={getDefaultConfig()}
        columns={this.columns}
        api={() => Promise.resolve({ records: [{}]})}
      />
    )
  }
}

export default Main