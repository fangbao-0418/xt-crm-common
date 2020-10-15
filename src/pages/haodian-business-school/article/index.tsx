import React from 'react'
import { FormItem, If, SelectFetch } from '@/packages/common/components'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { defaultFormConfig, statusEnums, columnEnums } from './config'
import { Button, Icon, Switch, Popconfirm } from 'antd'
import { getAllColumn, getArticleList, modifyDiscoverArticle } from './api'

class Main extends React.Component {
  public listRef: ListPageInstanceProps
  public columns = [{
    title: 'ID',
    width: 50,
    dataIndex: 'id'
  }, {
    title: '',
    width: 560,
    render: (record: any) => {
      return (
        <div>
          <div>{record.title}</div>
          <div>
            <span>
              <Icon type='user' />
              浏览量：{record.articlePv}
            </span>
            <span style={{ marginLeft: 50 }}>
              <Icon type='like' />
              <span>有用：{record.usefulNum}</span>
            </span>
            <span style={{ marginLeft: 50 }}>分享：{record.shareNum}</span>
            <span style={{ marginLeft: 50 }}>{APP.fn.formatDate(record.releaseTime, 'YYYY-MM-DD')}发布</span>
          </div>
          <div>{record.context}</div>
        </div>
      )
    }
  }, {
    title: '栏目',
    dataIndex: 'columnName'
  }, {
    title: '状态',
    dataIndex: 'releaseStatus',
    render: (text: any) => statusEnums[text]
  }, {
    title: '置顶',
    dataIndex: 'topStatus',
    // 1 未置顶 2 已置顶
    render: (text: 1 | 2, records: any) => {
      return (
        <Switch
          checkedChildren='开'
          unCheckedChildren='关'
          checked={text === 2}
          onChange={(checked) => {
            this.handleTopOperate({ topStatus: checked ? 2 : 1, id: records.id })
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
          {/* <If> */}
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
          {/* </If> */}
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
  public handleTopOperate = async (vals: any) => {
    const res = await modifyDiscoverArticle(vals)
    if (res) {
      APP.success('操作成功')
      this.listRef.refresh()
    }
  }
  // 发布文章
  public publishArticle = () => {
    APP.history.push('/haodian-business-school/article/-1')
  }
  public render () {
    return (
      <ListPage
        api={getArticleList}
        getInstance={ref => this.listRef = ref}
        formItemLayout={(
          <>
            <FormItem name='title' />
            <FormItem
              label='栏目'
              inner={(form) => {
                return form.getFieldDecorator('columnId')(
                  <SelectFetch fetchData={getAllColumn} />
                )
              }}
            />
          </>
        )}
        addonAfterSearch={<Button type='primary' onClick={this.publishArticle}>发布文章</Button>}
        formConfig={defaultFormConfig}
        columns={this.columns}
      />
    )
  }
}

export default Main