import React from 'react'
import Image from '@/components/Image'
import classNames from 'classnames'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Row, Col, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
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
    dataIndex: 'nickName',
    width: 300
  }, {
    title: '提现流水号',
    dataIndex: 'fansTotal',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'anchorIdentityType',
    title: '金额',
    width: 150
  }, {
    dataIndex: 'anchorId',
    title: '提现账户',
    width: 120,
    align: 'center'
  }, {

    dataIndex: 'anchorLevel',
    title: '状态',
    width: 100
  }, {
    dataIndex: 'anchorLevel',
    title: '申请时间',
    width: 100
  }, {
    dataIndex: 'anchorLevel',
    title: '完成时间',
    width: 100
  }, {
    dataIndex: 'anchorLevel',
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
