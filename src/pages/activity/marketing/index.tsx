import React from 'react'
import { Table, Button, Popconfirm } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as api from './api'
import Search from './Search'

interface State {
  dataSource: any[]
  total: number
  page: number
  pageSize: number
}
class Main extends React.Component<{}, State> {
  public payload: Marketing.ActivityListPayloadProps = {
    page: 1,
    pageSize: 10
  }
  public columns: ColumnProps<Marketing.ItemProps>[] = [
    {
      title: '活动编号',
      dataIndex: 'id'
    },
    {
      title: '活动名称',
      dataIndex: 'title'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '变更时间',
      dataIndex: 'modifyTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {title: '最后操作人', dataIndex: 'operator'},
    {
      title: '活动状态',
      dataIndex: 'statusText'
    },
    {
      title: '操作',
      width: 160,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            {[1, 2].indexOf(record.discountsStatus) > -1 &&  <span
              className='href mr10'
              onClick={() => {
                APP.history.push(`/activity/marketing/edit/${record.id}`)
              }}
            >
              编辑
            </span>}
            {[1].indexOf(record.discountsStatus) === -1 && <span
              className='href mr10'
              onClick={() => {
                APP.history.push(`/activity/marketing/view/${record.id}`)
              }}
            >
              查看
            </span>}
            {[1, 2].indexOf(record.discountsStatus) > -1 && (
              <Popconfirm
                title="确定关闭该活动吗"
                onConfirm={() => {
                  api.changeActivityStatus([record.id]).then(() => [
                    this.fetchData()
                  ])
                }}
                okText="确定"
                cancelText="取消"
              >
                <span
                  className='href'
                >
                  关闭
                </span>
              </Popconfirm>
            )}
          </div>
        )
      }
    }
  ]
  public state: State = {
    dataSource: [],
    pageSize: this.payload.pageSize,
    page: this.payload.page,
    total: 0
  }
  public componentWillMount () {
    this.fetchData()
  }
  public fetchData () {
    this.setState({
      page: this.payload.page
    })
    api.fetchMarketingList(this.payload).then((res: any) => {
      console.log(res)
      this.setState({
        dataSource: res.records || [],
        total: res.total
      })
    })
  }
  public render () {
    const { dataSource, total, page, pageSize } = this.state
    return (
      <div>
        <Search
          onSearch={(value) => {
            console.log(value, '--------')
            this.payload = {
              ...this.payload,
              ...value,
              page: 1
            }
            this.fetchData()
          }}
        />
        <div
          style={{
            marginTop: 20,
            padding: 20,
            background: '#FFFFFF'
          }}
        >
          <div
            className='mb10'
          >
            <Button
              type='primary'
              onClick={() => {
                APP.history.push('/activity/marketing/edit/-1')
              }}
            >
              新增活动
            </Button>
          </div>
          <Table
            rowKey='id'
            dataSource={dataSource}
            columns={this.columns}
            pagination={{
              total,
              pageSize,
              current: page,
              onChange: (current) => {
                this.payload.page = current
                this.fetchData()
              }
            }}
          />
        </div>
      </div>
    )
  }
}
export default Main