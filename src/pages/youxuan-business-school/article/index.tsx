import React from 'react'
import { FormItem, If, SelectFetch } from '@/packages/common/components'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { defaultFormConfig, statusEnums, columnEnums } from './config'
import { Button, Icon, Switch, Popconfirm } from 'antd'
import { deleteArticle, getAllColumn, getArticleList, modifyArticleStatus, modifyDiscoverArticle, modifyTopStatus } from './api'
import { Alert } from '@/packages/common/components'
import ClipboardJS from 'clipboard'
import { h5Host } from '@/util/baseHost'

class Main extends React.Component<AlertComponentProps, {}> {
  public listRef: ListPageInstanceProps
  public clipboard: any
  public componentDidMount () {
    this.clipboard = new ClipboardJS('.copy-btn')
    this.clipboard.on('success', () => {
      APP.success('复制链接成功')
    })
  }
  public componentWillUnmount () {
    this.clipboard.destroy()
  }
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
          <div style={{ cursor: 'pointer', fontWeight: 600 }} onClick={this.handlePrivew.bind(null, record.id)}>{record.title}</div>
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
          <div
            style={{
              overflow: 'hidden',
              display: '-webkit-box',
              textOverflow:'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '21px',
              cursor: 'pointer'
            }}
            onClick={this.handlePrivew.bind(null, record.id)}
            dangerouslySetInnerHTML={{ __html: record.context}}
          ></div>
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
    render: (text: 1 | 2, record: any) => {
      return (
        <Switch
          checkedChildren='开'
          unCheckedChildren='关'
          checked={text === 2}
          onChange={(checked) => {
            this.handleTopOperate({ topStatus: checked ? 2 : 1, id: record.id })
          }}
        />
      )
    }
  }, {
    title: '操作',
    width: 280,
    render: (record: any) => {
      return (
        <>
          <span className='href' onClick={this.handlePrivew.bind(null, record.id)}>预览</span>
          <span
            className='href ml10 copy-btn'
            data-clipboard-text={`${h5Host}/promotion/college/index.html#/detail?id=${record.id}`}
          >
            复制链接
          </span>
          <span className='href ml10' onClick={this.handleEdit.bind(null, record.id)}>编辑</span>
          
          {/* 10 草稿 20 视音频处理 30 待发布(未到发布时间) 40 已发布 50 已下架 */}
          {/* 已下架才可以删除 */}
          <If condition={[10, 50].includes(record.releaseStatus)}>
            <Popconfirm
              placement='top'
              title='你确定要删除这篇内容吗？'
              onConfirm={() => this.handleDelete(record.id)}
              okText='确认'
              cancelText='取消'
              className='ml10'
            >
              <span style={{ color: 'red', cursor: 'pointer' }}>删除</span>
            </Popconfirm>
          </If>
          <If condition={[20, 30, 40].includes(record.releaseStatus)}>
            <Popconfirm
                placement='top'
                title='你确定要下架这篇内容吗？'
                onConfirm={() => this.modifyStatus({ id: record.id, status: 2 })}
                okText='确认'
                cancelText='取消'
                className='ml10'
              >
                <span style={{ color: 'red', cursor: 'pointer' }} className='ml10'>下架</span>
              </Popconfirm>
          </If>
          <If condition={50 === record.releaseStatus}>
            <Popconfirm
                placement='top'
                title='你确定要上架这篇内容吗？'
                onConfirm={() => this.modifyStatus({ id: record.id, status: 1 })}
                okText='确认'
                cancelText='取消'
                className='ml10'
              >
                <span style={{ color: 'red', cursor: 'pointer' }} className='ml10'>上架</span>
              </Popconfirm>
          </If>
        </>
      )
    }
  }]
  public handlePrivew = (id: string) => {
    this.props.alert({
      title: null,
      content: (
        <iframe
          style={{ border: '1px solid #ccc'}}
          width={375}
          height={667}
          src={`${h5Host}/promotion/college/index.html#/preview?id=${id}`}
        />
      ),
      footer: null
    })
  }
  // 编辑
  public handleEdit = (id: number) => {
    APP.history.push(`/youxuan-business-school/article/${id}`)
  }
  // 删除
  public handleDelete = async (id: number) => {
    const res = await deleteArticle({
      id
    })
    if (res) {
      APP.success('操作成功')
      this.listRef.refresh()
    }
  }
  // 修改文章上下架状态
  public modifyStatus = async (payload: {
    id: number,
    status: 1 | 2
  }) => {
    const res = await modifyArticleStatus(payload)
    if (res) {
      APP.success('操作成功')
      this.listRef.refresh()
    }
  }
  // 置顶
  public handleTopOperate = async (vals: any) => {
    const res = await modifyTopStatus(vals)
    if (res) {
      APP.success('操作成功')
      this.listRef.refresh()
    }
  }
  // 发布文章
  public publishArticle = () => {
    APP.history.push('/youxuan-business-school/article/-1')
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

export default Alert(Main)