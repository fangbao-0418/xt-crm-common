import React, { RefObject } from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { If } from '@/packages/common/components'
import { ColumnProps } from 'antd/es/table'
import { Button, Popconfirm } from 'antd'
import { platformEnum } from './config'
import Color from './Color'
import Detail from './Detail'
import { getColumnList, deleteColumn } from './api'

interface State {
  dataSource: any
}
class Main extends React.Component<{}, State> {
  public state = {
    dataSource: undefined
  }
  public listRef: ListPageInstanceProps
  public detailRef: RefObject<Detail> = React.createRef<Detail>()
  public columns: ColumnProps<any>[] = [{
    title: '栏目名称',
    dataIndex: 'columnName'
  }, {
    title: '描述',
    dataIndex: 'description'
  }, {
    title: '渠道',
    dataIndex: 'platform',
    render: (text) => platformEnum[text]
  }, {
    title: '课程数量',
    dataIndex: 'articleNum'
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '显示状态',
    dataIndex: 'showStatus',
    render: (text) => <Color status={text}/>
  }, {
    title: '操作',
    width: 200,
    render: (record) => {
      return (
        <>
          <span className='href' onClick={this.handleView.bind(null, record)}>查看</span>
          <span className='href ml10' onClick={this.handleEdit.bind(null, record)}>编辑</span>
          {/* 是否删除 0 能删除 1 不能删除 */}
          <If condition={record.canDelete === 0}>
            <Popconfirm className='href ml10' placement="top" title='你确定要删除此栏目吗？' onConfirm={this.handleDelete.bind(null, record.id)} okText="确认" cancelText="取消">
              <span>删除</span>
            </Popconfirm>
          </If>
        </>
      )
    } 
  }]
  public handleView = (record: any) => {
    this.setState({ dataSource: record })
    this.detailRef.current?.open(true)
  }
  public handleEdit = (record: number) => {
    this.setState({ dataSource: record })
    this.detailRef.current?.open()
  }
  public handleDelete = async (id: number) => {
    const res = await deleteColumn(id)
    if (res) {
      APP.success('删除成功')
      this.listRef.refresh()
    }
  }
  public handleAdd = () => {
    this.detailRef.current?.open()
  }
  public render () {
    const { dataSource } = this.state
    return (
      <>
        <Detail
          dataSource={dataSource}
          ref={this.detailRef}
          refresh={() => {
            this.listRef.refresh()
          }}
        />
        <ListPage
          getInstance={(ref) => this.listRef = ref}
          addonAfterSearch={<Button icon='plus' type='primary' onClick={this.handleAdd}>新建栏目</Button>}
          columns={this.columns}
          api={getColumnList}
        />
      </>
    )
  }
}

export default Main