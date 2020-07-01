/**
 * 外部账户余额查询-供应商
 */
import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tag, Popconfirm, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '商家ID',
    dataIndex: 'supplierId',
    width: 100
  }, {
    title: '商家名称',
    dataIndex: 'supplierName',
    width: 100,
    align: 'center'
  }, {
    dataIndex: 'supplierType',
    title: '商家类型',
    width: 100
  }, {
    dataIndex: 'merchantAcctAvailBal',
    title: '商家账户余额（元）',
    width: 150,
    render: (text: any, record: any) => <>{record?.merchantsSubAccount?.acctAvailBal}</>
  }, {
    dataIndex: 'plainAcctAvailBal',
    title: '普通账户余额（元）',
    width: 150,
    render: (text: any, record: any) => <>{record?.plainSubAccount?.acctAvailBal}</>
  }, {
    dataIndex: 'merchantCashAmt',
    title: '商家账户可提现余额（元）',
    width: 180,
    render: (text: any, record: any) => <>{record?.merchantsSubAccount?.cashAmt}</>
  }, {
    dataIndex: 'plainCashAmt',
    title: '普通账户可提现余额（元）',
    width: 180,
    render: (text: any, record: any) => <>{record?.plainSubAccount?.cashAmt}</>
  }, {
    dataIndex: 'queryBalanceQueryTime',
    title: '更新日期',
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
            rowKey: 'supperId'
          }}
          processPayload={(payload) => {
            if (payload.page) {
              delete payload.page
            }
            if (payload.pageSize) {
              delete payload.pageSize
            }
            return {
              ...payload
            }
          }}
          onSubmit={()=>{
            const values=this.listpage.form.getValues()
            if (!values.supperId&&!values.supplierName) {
              APP.error('ID和名字至少有一项不能为空')
              return
            }
            this.listpage.refresh()
          }}
          onReset={()=>{
            this.listpage.form.setValues({
              supperId: undefined,
              supplierName: undefined
            })
          }}
          autoFetch={false}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='supperId' />
              <FormItem name='supplierName' />
            </>
          )}
          api={api.supplierBalance}
        />
      </div>
    )
  }
}
export default Alert(Main)
