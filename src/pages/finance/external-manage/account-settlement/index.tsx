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
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<any>[] = [{
    title: '财务结算流水号',
    dataIndex: 'flowNo',
    width: 200
  }, {
    title: '财务结算ID',
    dataIndex: 'id',
    width: 300
  }, {
    dataIndex: 'inOrOutTypeDesc',
    title: '收支类型',
    width: 150
  }, {
    dataIndex: 'amount',
    title: '账务金额',
    width: 120,
    render: (text) => APP.fn.formatMoney(text)
  }, {
    dataIndex: 'subjectTypeDesc',
    title: '账务对象类型',
    width: 100
  }, {
    dataIndex: 'subjectId',
    title: '账务对象ID',
    width: 100
  }, {
    dataIndex: 'subjectName',
    title: '账务对象名称',
    width: 100
  }, {
    dataIndex: 'applicationRemark',
    title: '原因',
    width: 100
  }, {
    dataIndex: 'createTime',
    title: '创建时间',
    width: 100
  }, {
    dataIndex: 'creator',
    title: '创建人',
    width: 100
  }, {
    dataIndex: 'outFlowNo',
    title: '三方处理流水',
    width: 100
  }, {
    dataIndex: 'outProcessStatusDesc',
    title: '三方处理结果',
    width: 100
  }, {
    dataIndex: 'outFinishedTime',
    title: '三方处理完成时间',
    width: 100
  }]
  public refresh () {
    this.listpage.refresh()
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
            rowKey: 'id'
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={() => {
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
