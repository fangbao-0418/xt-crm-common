import React, { RefObject } from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/es/table'
import { Button, Popconfirm } from 'antd'
import { channelEnum } from './config'
import Color from './Color'
import Detail from './Detail'
import { deleteColumn } from './api'

class Main extends React.Component {
  public listRef: ListPageInstanceProps
  public detailRef: RefObject<Detail> = React.createRef<Detail>()
  public columns: ColumnProps<any>[] = [{
    title: '栏目名称',
    dataIndex: 'name'
  }, {
    title: '描述',
    dataIndex: 'desc'
  }, {
    title: '渠道',
    dataIndex: 'channel',
    render: (text) => channelEnum[text]
  }, {
    title: '课程数量',
    dataIndex: 'count'
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '显示状态',
    dataIndex: 'status',
    render: (text) => <Color status={text}/>
  }, {
    title: '操作',
    width: 200,
    render: (records) => {
      return (
        <>
          <span className='href' onClick={this.handleView.bind(null, records.id)}>查看</span>
          <span className='href ml10' onClick={this.handleEdit.bind(null, records.id)}>编辑</span>
          <Popconfirm className='href ml10' placement="top" title='你确定要删除此栏目吗？' onConfirm={this.handleDelete.bind(null, records.id)} okText="确认" cancelText="取消">
            <span>删除</span>
          </Popconfirm>
        </>
      )
    } 
  }]
  public handleView = (id: number) => {
    this.detailRef.current?.open(id, true)
  }
  public handleEdit = (id: number) => {
    this.detailRef.current?.open(id)
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
  public getList () {
    return Promise.resolve({
      records: [{
        id: 0,
        name: '喜团资讯',
        desc: '这是一段描述，关于这个应用的描述',
        channel: 30,
        count: 55,
        sort: 55,
        status: 0
      }, {
        id: 1,
        name: '隐藏备用',
        desc: '这是一段描述，关于这个应用的描述',
        channel: 10,
        count: 2,
        sort: 2,
        status: 1
      }]
    })
  }
  public render () {
    return (
      <>
        <Detail ref={this.detailRef} />
        <ListPage
          getInstance={(ref) => this.listRef = ref}
          addonAfterSearch={<Button icon='plus' type='primary' onClick={this.handleAdd}>新建栏目</Button>}
          columns={this.columns}
          api={this.getList}
        />
      </>
    )
  }
}

export default Main