/**
 * 外部账户余额查询-供应商
 */
import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tag, Popconfirm, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, SupplierTypeEnum } from '../config'
import * as api from '../api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '商家ID',
    dataIndex: 'supplierId',
    width: 80
  }, {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 150
  }, {
    dataIndex: 'supplierType',
    title: '商家类型',
    width: 180,
    render: (text: any, record: any) => <>{SupplierTypeEnum[text]}</>
  }, {
    dataIndex: 'merchantAcctAvailBal',
    title: '可提现余额',
    width: 120,
    render: (text: any, record: any) => <>{record?.merchantsSubAccount?.acctAvailBal/100}</>
  }, {
    dataIndex: 'plainAcctAvailBal',
    title: '待结算金额',
    width: 120,
    render: (text: any, record: any) => <>{record?.plainSubAccount?.acctAvailBal/100}</>
  }, {
    dataIndex: 'merchantCashAmt',
    title: '冻结金额',
    width: 120,
    render: (text: any, record: any) => <>{record?.merchantsSubAccount?.cashAmt/100}</>
  }, {
    dataIndex: 'plainCashAmt',
    title: '已提现金额',
    width: 120,
    render: (text: any, record: any) => <>{record?.plainSubAccount?.cashAmt/100}</>
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
          style={{
            padding: 0
          }}
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
              APP.error('供应商ID和名称至少有一项不能为空')
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
