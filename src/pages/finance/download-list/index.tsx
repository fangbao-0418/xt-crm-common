//  财务管理-下载列表

import React from 'react'
import { Table, Tag, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as api from './api'
import Page from '@/components/page'
import { TypeEnum } from './config'
interface State {
  pageSize: number
  page: number
  total: number
  data: any[]
  loading: boolean
}

interface Info {
  /** 1-订单导出, 2-售后订单导出, 3-财务对账单详情导出, 4-结算单明细导出  */
  type: number
  /** 0-新建；1-处理中；2-完成 3-处理失败 */
  status: number
}

class Main extends React.Component {
  public payload: any = {
    pageSize: 10,
    pageNum: 1
  }
  public columns: ColumnProps<Info>[] = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      width: 250,
      render: (fileName: string) => {
        return (
          <div>{fileName ? fileName : '-'}</div>
        )
      }
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      render: (text) => {
        return (
          TypeEnum[text]
        )
      }
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        // 0-新建；1-处理中；2-完成 3-处理失败
        let color = 'geekblue'
        switch (text) {
          case '处理完毕':
            color = 'green'
            break
          case '处理失败':
            color = '#f50'
            break
        }
        return (
          <Tag
            color={color}
          >
            {text}
          </Tag>
        )
      }
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      render: (createTime) => {
        return APP.fn.formatDate(createTime)
      }
    }, {
      title: '备注',
      dataIndex: 'failReason',
      width: 200,
      render: (failReason) => {
        return (
          <div>
            {failReason ? failReason : '-'}
          </div>
        )
      }
    }, {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (record) => {
        let hasFile = false
        if (record.status === '处理完毕') {
          hasFile = true
        }
        return (
          <span>
            {hasFile ? <a onClick={() => APP.fn.download(record.fileUrl || '', TypeEnum[record.type] + APP.fn.formatDate(record.createTime, 'YYYY-MM-DD-HH-mm-ss'))}>下载</a> : ''}
            {/* <Divider type="vertical" /> */}
            {/* <a onClick={()=>this.handleDelete(record.id)}>删除</a> */}
          </span>
        )
      }
    }
  ]
  public state: State = {
    total: 0,
    page: this.payload.pageNum,
    pageSize: this.payload.pageSize,
    data: [],
    loading: false
  }
  public componentDidMount () {
    this.handleSearch(1)
  }
  /**
   * 搜索事件
   */
  public handleSearch (current?: number) {
    current = current || this.payload.pageNum
    this.setState({
      loading: true,
      page: current
    })
    api.getEarningsDetail({ current }).then((res) => {
      this.setState({
        total: res.total,
        loading: false,
        data: res.records
      })
    })
  }

  public render () {
    const { pageSize, page, total, data } = this.state
    return (
      <Page>
        <div>
          <Button
            type='primary'
            onClick={() => {
              this.handleSearch()
            }}
          >
            刷新
          </Button>
        </div>
        <Table
          pagination={{
            total,
            onChange: (current) => {
              this.payload.pageNum = current
              this.handleSearch(current)
            },
            pageSize,
            current: page
          }}
          columns={this.columns}
          dataSource={data}
        />
      </Page>
    )
  }
}
export default Main
