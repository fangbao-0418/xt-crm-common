/**
 * 账户调整-外部
 */
import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { ColumnProps } from 'antd/lib/table'
import { Button } from 'antd'
import { getFieldsConfig } from './config'
import * as api from './api'
import moment from 'moment'
import MoneyText from '@/components/money-text'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<any>[] = [{
    title: '账务结算流水号',
    dataIndex: 'flowNo',
    width: 220
  }, {
    title: '账务结算ID',
    dataIndex: 'settlementId',
    width: 220,
    render: (text, record) => {
      return (
        <span
          className='href'
          onClick={() => {
            APP.fn.setPayload('/finance/accountsettlement', {
              id: text,
              startTime: moment(record.settlementCreateTime).startOf('d').unix() * 1000,
              endTime: moment(record.settlementCreateTime).endOf('d').unix() * 1000
            })
            APP.open('/finance/accountsettlement')
          }}
        >
          {text}
        </span>
      )
    }
  }, {
    dataIndex: 'inOrOutTypeDesc',
    title: '收支类型',
    align: 'center',
    width: 150
  }, {
    dataIndex: 'amount',
    title: '账务金额',
    width: 120,
    align: 'center',
    render: (text) => <MoneyText value={text} />
  }, {
    dataIndex: 'subjectTypeDesc',
    title: '账务对象类型',
    width: 150
  }, {
    dataIndex: 'subjectId',
    title: '账务对象ID',
    width: 150
  }, {
    dataIndex: 'subjectName',
    title: '账务对象名称',
    width: 200
  }, {
    dataIndex: 'applicationRemark',
    title: '原因',
    width: 200
  }, {
    dataIndex: 'createTime',
    title: '创建时间',
    render: (text) => APP.fn.formatDate(text),
    width: 200
  }, {
    dataIndex: 'creator',
    title: '创建人',
    width: 100
  }, {
    dataIndex: 'outFlowNo',
    title: '三方处理流水',
    width: 220
  }, {
    dataIndex: 'outProcessStatusDesc',
    title: '三方处理结果',
    width: 200
  }, {
    dataIndex: 'outFinishedTime',
    title: '三方处理完成时间',
    render: (text) => APP.fn.formatDate(text),
    width: 200
  }]
  public refresh () {
    this.listpage.refresh()
  }
  public export () {
    api.exportFile({
      ...this.listpage.getPayload(),
      page: undefined,
      pageSize: undefined
    }).then(() => {
      APP.success('文件导出成功，前去下载列表进行下载')
    })
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFFFFF'
        }}
      >
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: 1000
            }
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={() => {
                  this.export()
                }}
              >
                批量导出
              </Button>
            </div>
          )}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='id' />
              <FormItem name='subjectId' />
              <FormItem name='subjectName' />
              <FormItem name='inOrOutType' />
              <FormItem name='processStatus' />
              <FormItem name='createTime' />
            </>
          )}
          rangeMap={{
            createTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          api={api.fetchList}
          processPayload={(payload) => {
            console.log(payload, 'payload')
            return {
              ...payload,
              startTime: payload.startTime || moment().subtract(30, 'days').startOf('d').unix() * 1000,
              endTime: payload.endTime || moment().endOf('d').unix() * 1000
            }
          }}
        />
      </div>
    )
  }
}
export default Alert(Main)
