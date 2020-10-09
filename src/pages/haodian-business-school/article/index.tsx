import React from 'react'
import { FormItem } from '@/packages/common/components'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { defaultFormConfig, statusEnums, columnEnums } from './config'
import { Button, Icon, Switch, Popconfirm } from 'antd'
import { topOperate } from './api'

class Main extends React.Component {
  public listRef: ListPageInstanceProps
  public columns = [{
    title: 'ID',
    width: 50,
    dataIndex: 'id'
  }, {
    title: '',
    width: 560,
    render: (records: any) => {
      return (
        <div>
          <div>{records.title}</div>
          <div>
            <span>
              <Icon type='user' />
              浏览量：{records.pv}
            </span>
            <span style={{ marginLeft: 50 }}>
              <Icon type='like' />
              <span>有用：{records.like}</span>
            </span>
            <span style={{ marginLeft: 50 }}>分享：{records.share}</span>
            <span style={{ marginLeft: 50 }}>2020-06-18发布</span>
          </div>
          <div>摘要我是内容我是内容我是内容，我是内容我是内容我是内容我是。内容我是内容我是内，容我是内容我是内容我是内容我。我是内容我是内容我是内容我是内容</div>
        </div>
      )
    }
  }, {
    title: '栏目',
    dataIndex: 'column',
    render: (text: any) => {
      return columnEnums[text]
    }
  }, {
    title: '状态',
    dataIndex: 'status',
    render: (text: any) => statusEnums[text]
  }, {
    title: '置顶',
    dataIndex: 'top',
    render: (text: boolean, records: any) => {
      return (
        <Switch
          checkedChildren='开'
          unCheckedChildren='关'
          checked={text}
          onChange={(checked) => {
            this.handleTopOperate({ checked, id: records.id })
          }}
        />
      )
    }
  }, {
    title: '操作',
    width: 220,
    render: (records: any) => {
      return (
        <>
          <span className='href'>复制</span>
          <span className='href ml10'>复制链接</span>
          <span className='href ml10' onClick={this.handleEdit.bind(null, records.id)}>编辑</span>
          <Popconfirm
            placement='top'
            title='你确定要删除这篇内容吗？'
            onConfirm={this.handleDelete}
            okText='确认'
            cancelText='取消'
            className='ml10'
          >
            <span style={{ color: 'red', cursor: 'pointer' }}>删除</span>
          </Popconfirm>
        </>
      )
    }
  }]
  public handleEdit = (id: number) => {
    APP.history.push(`/haodian-business-school/article/${id}`)
  }
  // 删除
  public handleDelete = () => {}
  // 置顶
  public handleTopOperate = (vals: any) => {

  }
  public fetchData = async () => {
    return Promise.resolve({
      records: [{
        id: 1,
        status: 0,
        title: '此处是标题',
        pv: 8488,
        like: 7454,
        share: 7454,
        column: 1
      }]
    })
  }
  public render () {
    return (
      <ListPage
        api={this.fetchData}
        formItemLayout={(
          <>
            <FormItem name='title' />
            <FormItem name='column' />
            <FormItem name='channel' />
          </>
        )}
        addonAfterSearch={<Button type='primary'>发布文章</Button>}
        formConfig={defaultFormConfig}
        columns={this.columns}
      />
    )
  }
}

export default Main