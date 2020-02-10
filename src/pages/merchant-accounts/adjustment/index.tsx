import React from 'react'
import { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import { getFieldsConfig } from './config'
import * as api from './api'
class Main extends React.Component {
  public columns = [
    {
      dataIndex: 'a',
      title: 'ID'
    },
    {
      dataIndex: 'a',
      title: '名称'
    },
    {
      dataIndex: 'a',
      title: '对账单ID'
    },
    {
      dataIndex: 'a',
      title: '调整类型'
    },
    {
      dataIndex: 'a',
      title: '调整原因'
    },
    {
      dataIndex: 'a',
      title: '金额'
    },
    {
      dataIndex: 'a',
      title: '状态'
    },
    {
      dataIndex: 'a',
      title: '创建人'
    },
    {
      dataIndex: 'a',
      title: '创建人类型'
    },
    {
      dataIndex: 'a',
      title: '创建时间'
    },
    {
      dataIndex: 'a',
      title: '采购审核人'
    },
    {
      dataIndex: 'a',
      title: '采购审核时间'
    },
    {
      dataIndex: 'a',
      title: '财务审核人'
    },
    {
      dataIndex: 'a',
      title: '财务审核'
    },
    {
      dataIndex: 'a',
      title: '操作',
      width: 300,
      align: 'center',
      render: () => {
        return (
          <div>
            <span
              className='href'
              onClick={() => { APP.history.push('/merchant-accounts/checking/32323') }}
            >
              查看明细
            </span>&nbsp;&nbsp;
            <span className='href'>导出</span>&nbsp;&nbsp;
            <span className='href'>新建调整单</span>
          </div>
        )
      }
    }
  ]
  public render () {
    return (
      <div>
        <ListPage
          columns={this.columns}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <FormItem name='a' />
          )}
          api={api.fetchCheckingList}
        />
      </div>
    )
  }
}
export default Main