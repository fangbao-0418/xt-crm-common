import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, Tabs } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig, TypeEnum, StatusEnum } from './config'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Detail from './Detail'
import { FormItem } from '@/packages/common/components'
import * as api from './api'

const StatusColors: any = {
  1: '#FFA551',
  2: '#00A206',
  3: 'red'
}

interface State  {
  activeKey: string
}

class Main extends React.Component<AlertComponentProps, State> {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '举报编号', dataIndex: 'id' },
    { title: '举报类型', dataIndex: 'type', render: (text) => TypeEnum[text] },
    { title: '评论内容', dataIndex: 'description', width: 300 },
    { title: '举报人', dataIndex: 'reportUserName', render: (text, record) => { return <span className='href' onClick={() => APP.open(`/user/detail?memberId=${record.reportUserId}`) }>{text}</span> } },
    { title: '商品ID', dataIndex: 'productId', render: (text, record) => { return <span className='href' onClick={() => APP.open(`/goods/sku-sale/${record.productId}`) }>{text}</span> } },
    { title: '举报时间', dataIndex: 'createTime', render: (text) => APP.fn.formatDate(text) },
    { title: '处理结果', dataIndex: 'status', align: 'center', render: (text) => { return (<span style={{ color: StatusColors[text] }}>{StatusEnum[text]}</span>) } },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            {record.status === 1 ? (
            <span
              className='href'
              onClick={this.showDetail.bind(this, record)}
            >
              审核
            </span>
            ) : (
              <span
                className='href'
                onClick={this.showDetail.bind(this, record)}
              >
                查看
              </span>
            )}
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public state: State = {
    activeKey: '-1'
  }
  public componentDidMount () {
    // this.showDetail()
  }
  public showDetail (record: RecordProps) {
    const hide = this.props.alert({
      width: 800,
      title: record.status !== 1 ? '查看' : '审核',
      content: (
        <Detail
          id={record.id}
          onOk={() => {
            hide()
            this.listpage.refresh()
          }}
          onCancel={() => {
            hide()
          }}
        />
      ),
      footer: null
    })
  }
  public render () {
    const { activeKey } = this.state
    return (
      <div>
        <ListPage
          columns={this.columns}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          addonAfterSearch={(
            <div>
              <div>
                {/* <Button
                  type='primary'
                  className='mr8'
                  onClick={() => {
                    APP.open('/goods/material?type=add')
                  }}
                >
                  添加素材
                </Button> */}
              </div>
              <div className='mt10'>
                <Tabs
                  type="card"
                  activeKey={activeKey}
                  onChange={(e) => {
                    this.setState({
                      activeKey: e
                    })
                    this.listpage.form.setValues({
                      status: e
                    })
                    this.listpage.refresh()
                  }}
                >
                  <Tabs.TabPane key="-1" tab='所有举报' />
                  <Tabs.TabPane key="2" tab='已审核举报' />
                  <Tabs.TabPane key="1" tab='待审核举报' />
                </Tabs>
              </div>
            </div>
          )}
          api={api.fetchList}
          processPayload={(payload) => {
            let status = undefined
            if (payload.status === '2') {
              status = [2, 3]
            } else if (payload.status === '1') {
              status = [1]
            }
            return {
              ...payload,
              status
            }
          }}
          onReset={() => {
            this.setState({
              activeKey: '-1'
            })
            this.listpage.refresh(true)
          }}
          formConfig={getFieldsConfig()}
          rangeMap={{
            createTime: {
              fields: ['startTime', 'endTime'],
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='productId' />
              <FormItem name='type' />
              <FormItem hidden name='status' />
              <FormItem name='createTime' />
            </>
          )}
        />
      </div>
    )
  }
}
export default Alert(Main)
