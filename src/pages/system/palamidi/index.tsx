import React from 'react'
import Page from '@/components/page'
import { FormItem } from '@/packages/common/components/form'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import ListPage from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'

interface Props extends AlertComponentProps {}

class Main extends React.Component<Props> {
  public columns: ColumnProps<{}>[] = [
    {
      title: '序号',
      dataIndex: 'x'
    },
    {
      title: 'Api名称',
      dataIndex: 'x'
    },
    {
      title: 'path',
      dataIndex: 'path'
    },
    {
      title: '映射地址',
      dataIndex: '映射地址'
    },
    {
      title: 'Server_id',
      dataIndex: 'Server_id'
    },
    {
      title: 'URL',
      dataIndex: 'Server_id'
    },
    {
      title: '前缀过滤',
      dataIndex: 'Server_id'
    },
    {
      title: '类型',
      dataIndex: 'Server_id'
    },
    {
      title: '操作',
      dataIndex: 'Server_id',
      align: 'center',
      render: () => {
        return (
          <div>
            <span onClick={this.edit(record)} className='href mr8'>修改</span>
            <span className='href'>修改</span>
          </div>
        )
      }
    }
  ]
  public edit = () => {

  }
  public render () {
    return (
      <Page>
        <ListPage
          formConfig={{
            common: {
              path: {
                type: 'input', label: 'path'
              },
              serverId: {
                type: 'input', label: 'Server_id'
              }
            }
          }}
          columns={this.columns}
          formItemLayout={(
            <>
              <FormItem name='path' />
              <FormItem name='serverId' />
            </>
          )}
          api={() => {
            return Promise.resolve({
              records: [{ path: '/abc' }]
            })
          }}
        />
      </Page>
    )
  }
}
export default Alert(Main)
