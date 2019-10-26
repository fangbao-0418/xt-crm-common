import React from 'react'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig } from './config'
import ListPage from '@/packages/common/components/list-page'
import * as api from './api'
class Main extends React.Component {
  public payload: any = {
    //
  }
  public columns: ColumnProps<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text, record, index) => {
        return index + 1
      }
    },
    {
      title: '消息标题',
      dataIndex: 'field1'
    },
    {
      title: '消息通道',
      dataIndex: 'field2'
    },
    {
      title: '消息类型',
      dataIndex: 'field3'
    },
    {
      title: '状态',
      dataIndex: 'field4'
    },
    {
      title: '发送时间',
      dataIndex: 'field5'
    },
    {
      title: '创建人',
      dataIndex: 'field6'
    },
    {
      title: '操作',
      render: () => {
        return (
          <div>
            <span>取消发送</span>
            <span
              className='href'
              onClick={() => {
                APP.history.push('/message/detail/22')
              }}
            >
              查看
            </span>
            <span>删除</span>
          </div>
        )
      }
    }
  ]
  public render () {
    return (
      <div>
        <ListPage
          formConfig={getFieldsConfig()}
          columns={this.columns}
          api={api.getList}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
              >
                发送消息
              </Button>
            </div>
          )}
        />
      </div>
    )
  }
}
export default Main
