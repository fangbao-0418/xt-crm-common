import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig, statusEnums } from './config'
import { ListPage, Alert } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Button, Modal } from 'antd'
import { getWithdrawalList, checkSmsVerifyCode, exportWithdrawal, createBatchWithdrawal, createAllWithdrawal } from './api'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { StatusType } from '.'
import WithdrawalModal from './WithdrawalModal'
interface Props extends AlertComponentProps {
  transferStatus: StatusType
}
interface State {
  // 短信验证码
  smsCode: string
}
class Main extends React.Component<Props, State> {
  public listPage: ListPageInstanceProps
  public state: State = {
    smsCode: ''
  }
  /** 确认提现 */
  public confirmWithdraw = (res: any) => {
    let batchId = ''
    let messageOrderNo = ''
    let smsCode = ''
    this.props.alert({
      title: '系统提示',
      content: (
        <WithdrawalModal
          detail={res}
          onChange={(val) => {
            batchId = val.batchId
            messageOrderNo = val.messageOrderNo
          }}
          onInput={(code) => {
            smsCode = code
          }}
        />
      ),
      onOk: async (hide) => {
        if (!batchId || !messageOrderNo) {
          APP.error('请先获取验证码')
          return
        }
        if (!smsCode) {
          APP.error('请输入验证码')
          return
        }
        const res = await checkSmsVerifyCode({
          batchId,
          messageOrderNo,
          smsCode
        })
        if (res) {
          APP.success('确认提现成功')
          hide();
          this.listPage.refresh()
        }
      }
    })
  }
  public columns: ColumnProps<any>[] = [{
    title: '申请单编号',
    width: 130,
    dataIndex: 'outTransferNo'
  }, {
    title: '提现流水号',
    width: 130,
    dataIndex: 'transferNo'
  }, {
    title: '金额',
    width: 70,
    dataIndex: 'transAmount',
    render: (text: number) => APP.fn.formatMoneyNumber(text, 'm2u')
  }, {
    title: '会员ID',
    width: 100,
    dataIndex: 'memberId'
  }, {
    title: '手机号',
    width: 100,
    dataIndex: 'memberPhone'
  }, {
    title: '会员等级',
    width: 100,
    dataIndex: 'memberTypeDesc'
  }, {
    title: '提现账户',
    align: 'center',
    render: (record: any) => {
      return (
        <div>
          <div>{record.accountName}</div>
          <div>{record.accountNumber}</div>
          <div>{record.bankName}</div>
        </div>
      )
    }
  }, {
    title: '身份信息',
    render: (record: any) => {
      return (
        <div>
          <div>{record.accountName}</div>
          <div>{record.accountIdCard}</div>
        </div>
      )
    }
  }, {
    title: '状态',
    width: 100,
    dataIndex: 'transferStatusDesc'
  }, {
    title: '申请时间',
    width: 120,
    dataIndex: 'createTime',
    render: (text: any) => APP.fn.formatDate(text)
  }, {
    title: '完成时间',
    width: 120,
    dataIndex: 'modifyTime',
    render: (text: any, record: any) => [statusEnums['提现失败'], statusEnums['提现成功']].includes(record.transferStatus) ? APP.fn.formatDate(text) : '-'
  }, {
    title: '操作',
    width: 120,
    render: (record: any) => {
      return record.transferStatus === statusEnums['待提现'] ? (
        <span className='href' onClick={this.withdrawal.bind(null, record.id)}>确认提现</span>
      ) : '-'
    }
  }, {
    title: '备注',
    width: 120,
    dataIndex: 'remark'
  }]
  // 提现列表导出
  public batchExport = async () => {
    const vals = this.listPage.form.getValues()
    const res = await exportWithdrawal(vals);
    if (res) {
      APP.success('批量导出成功')
    }
  }
  // 单条确认提现
  public withdrawal = async (id: string) => {
    const res = await createBatchWithdrawal(id)
    this.confirmWithdraw(res);
  }
  /** 批量提现 */
  public batchWithdrawal = () => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认批量提现',
      onOk: async () => {
        const vals = this.listPage.form.getValues()
        console.log('vals', vals)
        const res = await createAllWithdrawal(vals)
        if (res) {
          APP.success('批量提现成功')
        }
      }
    })
  }
  public render () {
    return (
      <ListPage
        getInstance={(ref) => this.listPage = ref }
        formConfig={getDefaultConfig()}
        rangeMap={{
          withdrawalDate: {
            fields: ['withdrawalStartDate', 'withdrawalEndDate']
          }
        }}
        processPayload={(payload) => {
          return {
            ...payload,
            transferStatus: this.props.transferStatus
          }
        }}
        addonAfterSearch={(
          <>
            <Button type='primary' onClick={this.batchExport}>批量导出</Button>
            {this.props.transferStatus === '' + statusEnums['待提现'] && <Button type='primary' className='ml10' onClick={this.batchWithdrawal}>批量确认提现</Button>}
          </>
        )}
        columns={this.columns}
        tableProps={{
          scroll: {
            x: true
          }
        }}
        api={getWithdrawalList}
      />
    )
  }
}

export default Alert(Main)