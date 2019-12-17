import React from 'react'
import { Button } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import withAlert, { AlertComponentProps } from '@/packages/common/components/alert'
import { getDefaultConfig } from './config'

interface Props extends AlertComponentProps {}
class Main extends React.Component<Props, any> {
  public list: ListPageInstanceProps
  public constructor (props: any) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
  }
  public columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '启用状态',
      key: 'status',
      dataIndex: 'status'
    },
    {
      title: '操作时间',
      key: 'operateTime',
      dataIndex: 'operateTime'
    },
    {
      title: '最后操作人',
      key: 'lastOperator',
      dataIndex: 'lastOperator'
    },
    {
      title: '操作',
      width: 180,
      render: () => {
        return (
          <div>
            <Button type='primary'>编辑</Button>
            {/* <Button type='primary' className='ml10'>停用</Button> */}
            <Button className='ml10'>启用</Button>
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
  public render () {
    return (
      <ListPage
        getInstance={ref => this.list = ref}
        formConfig={getDefaultConfig()}
        columns={this.columns}
        api={() => Promise.resolve({ records: [{}]})}
      />
    )
  }
}

export default withAlert(Main)