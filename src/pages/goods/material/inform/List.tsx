import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, Tabs } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig } from './config'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Detail from './Detail'
import { FormItem } from '@/packages/common/components'

class Main extends React.Component<AlertComponentProps> {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '举报编号', dataIndex: 'id' },
    { title: '举报类型', dataIndex: 'type', render: (text) => APP.fn.formatMoneyNumber(text, 'u2m') },
    { title: '评论内容', dataIndex: 'description' },
    { title: '举报人', dataIndex: 'reportId' },
    { title: '商品ID', dataIndex: 'productId' },
    { title: '举报时间', dataIndex: 'createTime' },
    { title: '处理结果', dataIndex: 'status' },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: () => {
        return (
          <div>
            <Button
              type='primary'
              size='small'
              className='mb8'
            >
              查看
            </Button>
            <Button
              size='small'
            >
              审核
            </Button>
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public componentDidMount () {
    this.showDetail()
  }
  public showDetail () {
    this.props.alert({
      width: 800,
      content: (
        <Detail />
      ),
      footer: null
    })
  }
  public render () {
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
                <Button
                  type='primary'
                  className='mr8'
                  onClick={() => {
                    this.listpage.refresh()
                  }}
                >
                  添加素材
                </Button>
              </div>
              <div className='mt10'>
                <Tabs type="card">
                  <Tabs.TabPane key="1" tab='所有举报' />
                  <Tabs.TabPane key="2" tab='已审核举报' />
                  <Tabs.TabPane key="3" tab='待审核举报' />
                </Tabs>
              </div>
            </div>
          )}
          api={() => {
            return Promise.resolve({
              total: 0,
              records: [
                {
                  supplierCashOutId: '2222'
                }
              ]
            })
          }}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='productId' />
              <FormItem name='type' />
              <FormItem name='status' />
              <FormItem name='createTime' />
            </>
          )}
        />
      </div>
    )
  }
}
export default Alert(Main)
