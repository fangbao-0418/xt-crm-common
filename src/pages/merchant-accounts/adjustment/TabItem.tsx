import React from 'react'
import { Button } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Detail from './Detail'
import { getFieldsConfig } from './config'
import * as api from './api'

interface Props extends Partial<AlertComponentProps> {}

class Main extends React.Component<Props> {
  public columns = [
    {
      dataIndex: 'a',
      title: 'ID'
    },
    {
      dataIndex: 'a',
      title: '名称'
    },
    {
      dataIndex: 'a',
      title: '对账单ID'
    },
    {
      dataIndex: 'a',
      title: '调整类型'
    },
    {
      dataIndex: 'a',
      title: '调整原因'
    },
    {
      dataIndex: 'a',
      title: '金额'
    },
    {
      dataIndex: 'a',
      title: '状态'
    },
    {
      dataIndex: 'a',
      title: '创建人'
    },
    {
      dataIndex: 'a',
      title: '创建人类型'
    },
    {
      dataIndex: 'a',
      title: '创建时间'
    },
    {
      dataIndex: 'a',
      title: '采购审核人'
    },
    {
      dataIndex: 'a',
      title: '采购审核时间'
    },
    {
      dataIndex: 'a',
      title: '财务审核人'
    },
    {
      dataIndex: 'a',
      title: '财务审核'
    },
    {
      dataIndex: 'a',
      title: '操作',
      width: 300,
      align: 'center',
      render: () => {
        return (
          <div>
            <span
              className='href'
              onClick={() => { APP.history.push('/merchant-accounts/checking/32323') }}
            >
              查看明细
            </span>&nbsp;&nbsp;
            <span className='href'>导出</span>&nbsp;&nbsp;
            <span className='href'>新建调整单</span>
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  /** 添加调整单 */
  public addAdjustment = () => {
    if (this.props.alert) {
      this.props.alert({
        width: 600,
        title: '新建调整单',
        content: <Detail />
      })
    }
  }
  public render () {
    return (
      <div>
        <ListPage
          getInstance={(ref) => {
            this.listpage = ref
            // this.addAdjustment()
          }}
          columns={this.columns}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='a' />
              <FormItem name='c' />
              <FormItem name='e' />
              <FormItem name='d' />
              <FormItem name='a4' />
            </>
          )}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                className='mr10'
                onClick={() => { this.listpage.fetchData() }}
              >
                查询
              </Button>
              <Button className='mr10' onClick={() => { this.listpage.refresh(true) }} >取消</Button>
              <Button
                type='primary'
                onClick={this.addAdjustment}
              >
                新建调整单
              </Button>
            </div>
          )}
          api={api.fetchCheckingList}
        />
      </div>
    )
  }
}
export default Alert(Main)
