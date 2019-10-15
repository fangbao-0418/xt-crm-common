import React from 'react'
import { Table, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import malert, { AlertComponentProps } from '@/packages/common/components/alert'
import { getFieldsConfig } from './config'
interface State {
  dataSource: any[]
}
class Main extends React.Component<AlertComponentProps, State> {
  public form: FormInstance
  public columns: ColumnProps<any>[] = [
    {
      dataIndex: 'id',
      title: '商品ID'
    },
    {
      dataIndex: 'id1',
      title: '主图'
    },
    {
      dataIndex: 'productName',
      title: '商品名称'
    },
    {
      dataIndex: 'status',
      title: '上架状态'
    },
    {
      dataIndex: '供应商',
      title: '供应商'
    },
    {
      dataIndex: '销售价',
      title: '销售价'
    },
    {
      dataIndex: 'id4',
      title: '最大分期期数'
    },
    {
      dataIndex: 'id5',
      title: '最大免息期数'
    },
    {
      dataIndex: 'id6',
      title: '操作',
      width: 140,
      align: 'center',
      render: () => {
        return (
          <div>
            <span
              className='href mr10'
              onClick={() => {
                APP.history.push('/activity/credit_pay/323')
              }}
            >
              编辑
            </span>
            <span
              className='href'
              onClick={() => {
                this.props.alert({
                  content: (
                    <div className='text-center'>
                      <div>是否关闭商品分期权限</div>
                      <div className='font12'>(关闭后商品不再显示在分期商品列表中)</div>
                    </div>
                  ),
                  onOk: (hide) => {
                    hide()
                  }
                })
              }}
            >
              关闭权限
            </span>
          </div>
        )
      }
    }
  ]
  public state: State = {
    dataSource: [{
      id: '1'
    }]
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFF',
          padding: 20
        }}
      >
        <div>
          <Form
            layout='inline'
            config={getFieldsConfig()}
            getInstance={(ref) => {
              this.form = ref
            }}
            addonAfter={(
              <div
                style={{
                  display: 'inline-block',
                  lineHeight: '40px',
                  verticalAlign: 'top'
                }}
              >
                <Button
                  type='primary'
                  className='mr10'
                >
                  查询
                </Button>
                <Button

                >
                  清除
                </Button>
              </div>
            )}
          >
          </Form>
        </div>
        <div
          className='mt10'
        >
          <div
          >
            <Button
              type='primary'
              className='mr10'
              onClick={() => {
                this.props.alert({
                  content: (
                    <div className='text-center'>
                      <div>是否关闭所有选中商品的分期权限</div>
                      <div className='font12'>(关闭后商品不再显示在分期商品列表中)</div>
                    </div>
                  ),
                  onOk: (hide) => {
                    hide()
                  }
                })
              }}
            >
              批量关闭分期权限
            </Button>
            <Button
              type='primary'
              onClick={() => {
                this.props.alert({
                  content: '新增分期商品',
                  onOk: (hide) => {
                    hide()
                  }
                })
              }}
            >
              新增分期商品
            </Button>
          </div>
          <Table
            className='mb10'
            columns={this.columns}
            dataSource={this.state.dataSource}
          />
        </div>
      </div>
    )
  }
}
export default malert<AlertComponentProps>(Main)
