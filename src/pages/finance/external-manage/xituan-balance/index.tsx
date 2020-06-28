import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Row, Col, Button } from 'antd'
import { getFieldsConfig } from './config'
import Withdraw from './components/Withdraw'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  state = {
    balance: 0

  }
  public columns: any = [{
    title: '申请单编号',
    dataIndex: 'id',
    width: 230
  }, {
    title: '提现流水号',
    dataIndex: 'transferNo',
    width: 200
  }, {
    dataIndex: 'accountAmount',
    title: '金额',
    width: 100
  }, {
    dataIndex: 'memberId',
    title: '提现账户',
    width: 120
  }, {
    dataIndex: 'status',
    title: '状态',
    width: 80
  }, {
    dataIndex: 'createTime',
    title: '申请时间',
    width: 220,
    render: (text: any) => <>{APP.fn.formatDate(text)}</>
  }, {
    dataIndex: 'modifyTime',
    title: '完成时间',
    width: 200,
    render: (text: any) => <>{APP.fn.formatDate(text)}</>
  }, {
    dataIndex: 'remark',
    title: '备注',
    width: 100
  }]
  public refresh () {
    this.listpage.refresh()
  }
  /** 提现 */
  public toWithdraw () {
    const { balance }=this.state
    this.props.alert({
      width: 500,
      title: '提现',
      footer: null,
      content: (
        <Withdraw balance={balance} />
      )
    })
  }
  public componentDidMount () {
    this.fetchAccountList()
  }
  public fetchAccountList () {
    api.platformBalance().then((res) => {
      this.setState({
        balance: res||0
      })
    })
  }
  public render () {
    const { balance }=this.state
    return (
      <div
        style={{
          background: '#FFFFFF',
          paddingTop: 20
        }}
      >
        <div style={{ border: '1px solid #999', padding: 20, margin: 20, marginTop: 0 }}>
          <div style={{}}>
            余额 ￥{balance}
            <Button
              type='primary'
              className='ml20'
              onClick={() => {
                this.listpage.refresh()
                this.fetchAccountList()
              }}
            >
                刷新
            </Button>
            <Button
              type='primary'
              className='ml20'
              onClick={() => {
                this.toWithdraw()
              }}
            >
                提现
            </Button>
          </div>
        </div>
        <div style={{ fontSize: 20, marginLeft: 20 }}>提现明细</div>
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'id'
          }}
          formConfig={false}
          api={api.getList}
        />
      </div>
    )
  }
}
export default Alert(Main)
