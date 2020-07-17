/**
 * 提现账户明细
 */
import React from 'react'
import { ListPage, Alert } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tabs, Button } from 'antd'
import MoneyRender from '@/components/money-render'
import { getFieldsConfig, SupplierTypeEnum } from './config'
import * as api from './api'
const { TabPane } = Tabs
interface Props extends AlertComponentProps {
}
const tabConfigs: { key: string, title: string }[] = [
  { key: '-2', title: '全部' },
  { key: '0', title: '提现中' },
  { key: '1', title: '提现成功' },
  { key: '-1', title: '提现失败' }
]
class Main extends React.Component<Props> {
  state = {
    status: '-2'
  }
  public listpage: ListPageInstanceProps
  public columns: any = [{
    title: '申请单编号',
    dataIndex: 'outTransferNo',
    width: 250,
    fixed: 'left'
  }, {
    title: '提现流水号',
    dataIndex: 'transferNo',
    width: 250
  }, {
    dataIndex: 'transAmount',
    title: '金额',
    width: 100,
    render: MoneyRender
  }, {
    dataIndex: 'supplierId',
    title: '供应商ID',
    width: 100
  }, {
    dataIndex: 'supplierName',
    title: '供应商名称',
    width: 150
  }, {
    dataIndex: 'supplierType',
    title: '供应商类型',
    render: (text: any) => {
      return SupplierTypeEnum[text]
    },
    width: 120
  }, {
    dataIndex: 'accountType',
    title: '提现方式',
    render: (text: any) => {
      let str=''
      switch (text) {
        case 'ALIPAY':
          str='支付宝'
          break
        case 'BANK':
          str='银行卡'
          break
        case 'PINGAN':
          str='平安银行卡'
          break
      }
      return str
    },
    width: 120
  }, {
    dataIndex: 'accountNumber',
    title: '提现账户',
    render: (text: any, recode: any) => {
      return (
        <div>
          <div>
            {recode.accountName}
          </div>
          <div>
            {recode.accountNumber}
          </div>
          <div>
            {recode.bankName}
          </div>
        </div>
      )
    },
    width: 120
  }, {
    dataIndex: 'accountIdCard',
    title: '身份信息',
    width: 100,
    render: (text: any, recode: any) => {
      return (
        <div>
          <div>
            {recode.accountIdCardAddress==='1'?recode.accountName:recode.supplierName}
          </div>
          <div>
            {recode.accountIdCard}
          </div>
        </div>
      )
    }
  }, {
    dataIndex: 'transferStatusDesc',
    title: '状态',
    width: 100
  }, {
    dataIndex: 'createTime',
    title: '申请时间',
    render: (text: any) => {
      return APP.fn.formatDate(text)
    },
    width: 200
  }, {
    dataIndex: 'modifyTime',
    title: '完成时间',
    render: (text: any, recode: any) => {
      return recode.transferStatus===1||recode.transferStatus===-1? APP.fn.formatDate(text):''
    },
    width: 200
  }, {
    dataIndex: 'anchorLevel',
    title: '备注',
    width: 200
  }]
  public refresh () {
    this.listpage.refresh()
  }

  // 切换tabPane
  public handleChange = (key: string) => {
    this.setState({
      status: key
    }, () => {
      this.listpage.refresh()
    })
  }

  public render () {
    const { status }=this.state
    return (
      <div
        style={{
          background: '#FFFFFF',
          paddingTop: 20
        }}
      >
        <Tabs
          activeKey={status}
          onChange={this.handleChange}
          style={{ marginLeft: 20 }}
        >
          {
            tabConfigs.map((item) => {
              return (
                <TabPane tab={item.title} key={item.key} />
              )
            })
          }
        </Tabs>
        <ListPage
          reserveKey='/finance/withdraw'
          namespace='/finance/withdraw'
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'id',
            scroll: {
              x: true
            }
          }}
          processPayload={({ ...payload }) => {
            if (status === '-2') { // tab 全部
              payload.transferStatus=undefined
            } else {
              payload.transferStatus=parseInt(status)
            }
            return {
              ...payload
            }
          }}
          rangeMap={{
            withdrawalDate: {
              fields: ['withdrawalStartDate', 'withdrawalEndDate']
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
            </div>
          )}
          formConfig={getFieldsConfig()}
          api={api.getList}
        />
      </div>
    )
  }
}
export default Alert(Main)
