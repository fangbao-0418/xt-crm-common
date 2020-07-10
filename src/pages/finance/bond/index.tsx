import React from 'react'
import { ListPage, Form, FormItem, Alert, If } from '@/packages/common/components'
import { getSummary, getRemittanceList, cancelRemittance, applyVoucher } from './api'
import { defaultConfig, NAME_SPACE } from './config'
import { Button, Modal, DatePicker } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { FormInstance } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils'

const { RangePicker } = DatePicker
interface WithdrawState {
  batchId: string,
  commonNum: number,
  interceptionAmount: number,
  interceptionNum: number,
  totalAmount: number,
  totalNum: number,
  commonAmount: number,
  totalRechargeAmount: number
  summary: {
    earliestDate: string
    totalAmount: number
  }
}
/**
 * 保证金管理
 */
class Index extends React.Component<AlertComponentProps, WithdrawState> {
  list: ListPageInstanceProps
  form: FormInstance
  batchPaymentForm: FormInstance
  batchId = (parseQuery() as any).batchId
  state: WithdrawState = {
    batchId: '',
    commonNum: 0,
    interceptionAmount: 0,
    interceptionNum: 0,
    totalAmount: 0,
    totalNum: 0,
    commonAmount: 0,
    totalRechargeAmount: 0,
    summary: {
      totalAmount: 0,
      earliestDate: ''
    }
  }
  columns = [{
    title: '序号',
    dataIndex: 'transferNo'
  }, {
    title: '商家名称',
    dataIndex: 'moneyAccountTypeDesc'
  }, {
    title: '业务类型',
    dataIndex: 'memberMobile'
  }, {
    title: '设置时间',
    dataIndex: 'createTime'
  }, {
    title: '状态',
    dataIndex: 'submitTime'
  }, {
    title: '操作',
    width: 220,
    fixed: 'right',
    align: 'center',
    render: (records: any) => {
      return (
        <>
            <span
              className='href ml10'
              onClick={() => {
                this.props.alert({
                  title: '认领保证金',
                  content: (
                    <Form
                      getInstance={ref => this.form = ref}
                      labelCol={{ span: 0 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <FormItem
                        placeholder='请输入取消原因（用户可见）*必填'
                        type='textarea'
                        name='remark'
                        verifiable
                        fieldDecoratorOptions={{
                          rules: [{
                            required: true,
                            message: '请输入取消原因（用户可见）*必填'
                          }]
                        }}
                        controlProps={{
                          rows: 5,
                          maxLength: 200
                        }}
                      />
                    </Form>
                  ),
                  onOk: (hide) => {
                    this.form.props.form.validateFields((err, vals) => {
                      if (!err) {
                        cancelRemittance({
                          id: records.id,
                          remark: vals.remark
                        }).then(res => {
                          if (res) {
                            APP.success('取消提现成功')
                            this.list.refresh()
                            hide()
                          }
                        })
                      }
                    })
                  }
                })
              }}
            >
              认领
            </span>
        </>
      )
    }
  }]
  componentDidMount () {
    const form = this.list.form
    if (form && this.batchId) {
      form.setValues({ batchId: this.batchId })
      this.list.fetchData()
    } else {
      this.list.refresh()
    }
    getSummary().then((res) => {
      this.setState({
        summary: res
      })
    })
  }
  applyVoucher = (record: any) => () => {
    const hide = this.props.alert({
      title: '提现凭证申请',
      width: 400,
      content: (
        <div>
          申请提现凭证后需要等待一段时间后方可下载提现凭证
        </div>
      ),
      onOk: () => {
        applyVoucher(record.id).then(() => {
          hide()
          this.list.refresh()
        })
      }
    })
  }
  getRemittanceList = async (data: any) => {
    if (data.submitTime) {
      if (data.submitTime[0]) {
        data.remitStartTime = data.submitTime[0].format('YYYY-MM-DD')
      }
      if (data.submitTime[1]) {
        data.remitEndTime = data.submitTime[1].format('YYYY-MM-DD')
      }
      delete data.submitTime
    }
    if (data.createTimeBegin) {
      data.createStartTime = data.createTimeBegin.substr(0, 10)
      delete data.createTimeBegin
    }
    if (data.createTimeEnd) {
      data.createEndTime = data.createTimeEnd.substr(0, 10)
      delete data.createTimeEnd
    }
    return getRemittanceList(data)
  }

  render () {
    return (
      <>
        <ListPage
          autoFetch={false}
          tableProps={{
            scroll: {
              x: true
            }
          }}
          namespace={NAME_SPACE}
          getInstance={(ref) => {
            this.list = ref
          }}
          formConfig={defaultConfig}
          columns={this.columns}
          api={this.getRemittanceList}
        />
      </>
    )
  }
}

export default Alert(Index)