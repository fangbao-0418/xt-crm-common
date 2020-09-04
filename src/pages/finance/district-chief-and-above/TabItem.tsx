import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig, statusEnums } from './config'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Button, Input, Form } from 'antd'
import styles from './style.module.styl'
import { getWithdrawalList, sendSmsVerifyCode, checkSmsVerifyCode, exportWithdrawal, createBatchWithdrawal } from './api'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { StatusType } from '.'

interface Props extends AlertComponentProps {
  transferStatus: StatusType
}
interface State {
  // 短信验证码
  smsCode: string
}
class Main extends React.Component<Props, State> {
  public listPage: ListPageInstanceProps
  // 批次ID
  public batchId: number
  // 平安短信指令号
  public messageOrderNo: string
  public state: State = {
    smsCode: ''
  }
  /** 发送验证码 */
  public sendAuthCode = async (batchId: string) => {
    const res = await sendSmsVerifyCode(batchId);
    if (res) {
      this.batchId = res.batchId
      this.messageOrderNo = res.messageOrderNo
    }
  }
  /** 确认提现 */
  public confirmWithdraw = (res: any) => {
    this.props.alert({
      title: '提示',
      content: (
        <div>
          <div className='mb10'>本次提现总额为<span className={styles['money']}>{APP.fn.formatMoneyNumber(res.totalAmount, 'm2u')}</span>元，请确认</div>
          <Form layout='inline'>
            <FormItem label='验证码'>
              <div>
                <Input
                  value={this.state.smsCode}
                  onChange={(e) => this.setState({ smsCode: e.target.value })}
                  className={styles['auth-code']}
                />
                <Button onClick={this.sendAuthCode.bind(null, res.batchId)}>获取</Button>
              </div>
              <div>验证码已发送至您手机号{(res.phone + '').replace(/(\d{3})\d{8}/, '$1********')}，请注意查收</div>
            </FormItem>
          </Form>
        </div>
      ),
      onOk: async (hide) => {
        const res = await checkSmsVerifyCode({
          batchId: this.batchId,
          messageOrderNo: this.messageOrderNo,
          smsCode: this.state.smsCode
        })
        if (res) {
          APP.success('确认提现成功')
          hide();
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
    dataIndex: 'transferStatus',
    render: (text: any) => {
      return statusEnums[text]
    }
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
  public batchExport = () => {
    // exportWithdrawal()
  }
  // 单条确认提现
  public withdrawal = async (id: string) => {
    const res = await createBatchWithdrawal(id)
    this.confirmWithdraw(res);
  }
  /** 批量提现 */
  public batchWithdrawal = () => {
    const vals = this.listPage.form.getValues()
    console.log('vals', vals)
    // Modal.confirm({
    //   title: '系统提示',
    //   content: '是否确认批量提现',
    //   onOk: () => {

    //   }
    // })
  }
  public render () {
    return (
      <ListPage
        getInstance={(ref) => this.listPage = ref }
        formConfig={getDefaultConfig()}
        processPayload={(payload) => {
          return {
            ...payload,
            transferStatus: this.props.transferStatus
          }
        }}
        addonAfterSearch={(
          <>
            <Button type='primary' onClick={this.batchExport}>批量导出</Button>
            <Button type='primary' className='ml10' onClick={this.batchWithdrawal}>批量确认提现</Button>
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