import React from 'react'
import { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import { getFieldsConfig } from './config'
import * as api from './api'
import MonthPicker from './components/MonthPicker'
class Main extends React.Component {
  public columns = [
    {
      dataIndex: 'a',
      title: '对账单ID'
    },
    {
      dataIndex: 'a',
      title: '日期'
    },
    {
      dataIndex: 'a',
      title: '供应商'
    },
    {
      dataIndex: 'a',
      title: '收入笔数'
    },
    {
      dataIndex: 'a',
      title: '收入（元）'
    },
    {
      dataIndex: 'a',
      title: '支出笔数'
    },
    {
      dataIndex: 'a',
      title: '支出（元）'
    },
    {
      dataIndex: 'a',
      title: '本期对对账单金额'
    },
    {
      dataIndex: 'a',
      title: '状态'
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
  public render () {
    return (
      <div>
        <ListPage
          columns={this.columns}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='a' />
              <FormItem
                label='月份'
                inner={(form) => {
                  return form.getFieldDecorator('ak47')(
                    <MonthPicker />
                  )
                }}
              />
            </>
          )}
          api={api.fetchCheckingList}
        />
      </div>
    )
  }
}
export default Main
