/**
 * 货款结算明细
 */
import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tag, Popconfirm, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import moment from 'moment'
import { formatMoneyWithSign } from '@/pages/helper'
import { getFieldsConfig, StoreTypeEnum } from './config'
import * as api from './api'
import If from '@/packages/common/components/if'
interface Props extends AlertComponentProps {
}
const dateFormat = 'YYYY-MM-DD HH:mm'
const getFormatDate = (s: any, e: any) => {
  return e ? [moment(s, dateFormat), moment(e, dateFormat)] : []
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  state = {
    selectedRowKeys: []
  }
  public columns: any = [{
    title: '结算流水号',
    dataIndex: 'id',
    width: 150
  }, {
    title: '分账流水',
    dataIndex: 'splitFlowNo',
    width: 100,
    align: 'center'
  }, {
    dataIndex: 'tradeNo',
    title: '交易编号',
    width: 100
  }, {
    dataIndex: 'tradeTypeDesc',
    title: '交易类型',
    width: 100
  }, {
    dataIndex: 'storeId',
    title: '供应商ID',
    width: 100
  }, {
    dataIndex: 'storeName',
    title: '供应商名称',
    width: 150
  }, {
    dataIndex: 'storeType',
    title: '供应商类型',
    width: 150,
    render: (text: any) => {
      return StoreTypeEnum[text]
    }
  }, {
    dataIndex: 'createTime',
    title: '创建时间',
    width: 100,
    render: (text: any) => <>{APP.fn.formatDate(text)}</>
  }, {
    dataIndex: 'amount',
    title: '本次结算金额',
    width: 150,
    render: (text: any) => <>{formatMoneyWithSign(text)}</>
  }, {
    dataIndex: 'profitRatio',
    title: '结算比例',
    width: 100,
    render: (text: any) => {
      const num=text?text*100:null
      return text?((text*100)+'%'):'-'
    }
  }, {
    dataIndex: 'settlementStatusDesc',
    title: '结算状态',
    width: 100
  }, {
    dataIndex: 'settlementTime',
    title: '结算时间',
    width: 100,
    render: (text: string | number | undefined) => <>{APP.fn.formatDate(text)}</>
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    align: 'center',
    render: (text: any, record: any) => {
      return (
        <If condition={record.settlementStatus===0}>
          <Popconfirm
            title='确定终止结算吗'
            onConfirm={this.terminated.bind(this, record)}
          >
            <span className='href'>终止结算</span>
          </Popconfirm>
        </If>
      )
    }
  }]
  public refresh () {
    this.listpage.form.setValues({
      startTime: moment().subtract(30, 'days').startOf('d'),
      endTime: moment().endOf('d')
    })
    this.listpage.refresh()
  }
  public terminated (record: any) {
    api.terminated(record.id).then(() => {
      this.refresh()
    })
  }
  public batchTerminated () {
    const { selectedRowKeys }=this.state
    if (selectedRowKeys&&selectedRowKeys.length>0) {
      api.batchTerminated(selectedRowKeys).then(() => {
        this.setState({
          selectedRowKeys: []
        }, ()=>{
          this.refresh()
          APP.success('终止结算成功')
        })
      })
    } else {
      APP.error('请选择需要终止的结算单')
    }
  }
  public handleSelectionChange = (selectedRowKeys: any) => {
    this.setState({
      selectedRowKeys
    })
  };
  public render () {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectionChange,
      getCheckboxProps: (record: any) =>
        ({
          disabled: record.settlementStatus !== 0
        })
    }

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
              x: this.columns.reduce((a: any, b:any) => {
                return (typeof a === 'object' ? a.width : a) as any + b.width
              }) as number
            }
          }}
          onReset={() => {
            this.listpage.form.setValues({
              tradeNo: undefined,
              tradeType: undefined,
              settlementStatus: undefined,
              storeId: undefined,
              storeName: undefined,
              storeType: undefined
            })
            this.refresh()
          }}
          rowSelection={rowSelection}
          rangeMap={{
            time: {
              fields: ['startTime', 'endTime']
            }
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
              <Popconfirm
                title='确定终止结算吗'
                className='ml8'
                onConfirm={this.batchTerminated.bind(this)}
              >
                <Button
                  type='primary'
                  onClick={() => {
                  }}
                >
                终止结算
                </Button>
              </Popconfirm>
            </div>
          )}
          mounted={() => {
            this.listpage.form.setValues({
              startTime: moment().subtract(30, 'days').startOf('d'),
              endTime: moment().endOf('d')
            })
          }}
          processPayload={(payload) => {
            return {
              ...payload
            }
          }}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='tradeNo' />
              <FormItem name='tradeType' />
              <FormItem name='settlementStatus' />
              <FormItem name='storeId' />
              <FormItem name='storeName' />
              <FormItem name='storeType' />
              <FormItem name='time' />
            </>
          )}
          api={api.getList}
        />
      </div>
    )
  }
}
export default Alert(Main)
