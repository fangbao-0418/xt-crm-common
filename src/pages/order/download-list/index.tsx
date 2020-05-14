// 订单管理-下载列表

import React from 'react'
import { Button, Table, Divider, Tag } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Page from '@/components/page'
import * as api from './api'
interface State {
  pageSize: number
  page: number
  total: number
  data: any[]
  loading: boolean
}

enum TypeEnum {
  订单导出 = 1,
  售后订单导出 = 2,
  财务对账单详情导出 = 3,
  结算单明细导出 = 4,
  财务对账单列表导出 = 5,
  财务结算单导出 = 6,
  财务付款单导出 = 7,
  财务调整单导出 = 8,
  买菜商品导出 = 201,
  买菜订单导出 = 202,
  买菜采购单导出 = 301,
  买菜门店订单导出 = 302
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
      dataIndex: 'fileName'
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
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
      render: (text) => {
        // 0-新建；1-处理中；2-完成 3-处理失败
        let d = '处理中'
        let color = 'geekblue'
        switch (text) {
        case 0:
          d = '处理中'
          break
        case 1:
          d = '处理中'
          break
        case 2:
          d = '完成'
          color = 'green'
          break
        case 3:
          d = '导出失败'
          color = '#f50'
          break
        }
        return (
          <Tag
            color={color}
          >
            {d}
          </Tag>
        )
      }
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (createTime) => {
        return APP.fn.formatDate(createTime)
      }
    }, {
      title: '备注',
      dataIndex: 'failReason',
      width: 200
    }, {
      title: '操作',
      key: 'action',
      render: (record) => {
        let hasFile = false
        if (record.status === 2) {
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
  public handleSearch (current: number) {
    this.setState({
      loading: true,
      page: this.payload.pageNum
    })
    api.getEarningsDetail(current).then((res) => {
      console.log(res, 'res')
      this.setState({
        total: res.total,
        loading: false,
        data: res.result
      }, () => {
        console.log(this.state.data, 'this.state.data')
      })
    })
  }

  public render () {
    const { pageSize, page, total, data } = this.state
    return (
      <Page>
        <div>
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
            // rowKey='id'
            columns={this.columns}
            dataSource={data}
          />
        </div>
      </Page>
    )
  }
}
export default Main
