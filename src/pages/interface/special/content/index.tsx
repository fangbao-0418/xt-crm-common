import React from 'react'
import { Button, Modal } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import withAlert, { AlertComponentProps } from '@/packages/common/components/alert'
import { getDefaultConfig } from './config'
import { queryFloor, updateStatus } from './api'
import { status } from './config'
import { ColumnProps } from 'antd/es/table'

interface Props extends AlertComponentProps {}

interface FloorProps {
  id: number
  floorName: string
  statusText: string
  status: number
  modifyTime: string
  operator: string
}
class Main extends React.Component<Props, any> {
  public list: ListPageInstanceProps
  public constructor (props: any) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }
  /** 启用、停止 */
  public handleUpdate (id: number, statusCode: 0 | 1) {
    const msg = status[statusCode]
      Modal.confirm({
        title: '系统提示',
        content: `确认${msg}吗?`,
        onOk: async () => {
          const res = await updateStatus(id)
          if (res) {
            APP.success(`${msg}成功`)
          }
        }
      })
  }
  public columns: ColumnProps<FloorProps>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: '名称',
      key: 'floorName',
      dataIndex: 'floorName'
    },
    {
      title: '启用状态',
      key: 'statusText',
      dataIndex: 'statusText'
    },
    {
      title: '操作时间',
      key: 'modifyTime',
      dataIndex: 'modifyTime'
    },
    {
      title: '最后操作人',
      key: 'operator',
      dataIndex: 'operator'
    },
    {
      title: '操作',
      width: 180,
      render: (text: any, records: FloorProps) => {
        return (
          <div>
            <Button
              type='primary'
              onClick={() =>{
                APP.history.push(`/interface/special-content/${records.id}`)
              }}>
                编辑
              </Button>
            {records.status === 1 && (
              <Button
                type='danger'
                className='ml10'
                onClick={() => this.handleUpdate(records.id, 0)}>
                停用
              </Button>
            )}
            {records.status === 0 && (
              <Button
                type='danger'
                className='ml10'
                onClick={() => this.handleUpdate(records.id, 1)}>
                启用
              </Button>
            )}
            {/* <Button
              type='danger'
              className='ml10'
              onClick={this.handleDelete}
            >
              删除
            </Button> */}
          </div>
        )
      }
    }
  ]
  public handleDelete () {
    this.props.alert({ content: '当前已关联活动中的专题，不允许停用/删除' })
  }
  public handleAdd () {
    APP.history.push('/interface/special-content/-1')
  }
  public render () {
    return (
      <ListPage
        rangeMap={{
          modifyTime: {
            fields: ['startModifyTime', 'endModifyTime']
          }
        }}
        addonAfterSearch={(
          <Button
            type='primary'
            onClick={this.handleAdd}>
            新增
          </Button>
        )}
        getInstance={ref => this.list = ref}
        formConfig={getDefaultConfig()}
        columns={this.columns}
        api={queryFloor}
      />
    )
  }
}

export default withAlert(Main)