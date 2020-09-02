import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig, statusEnums } from './config'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Button, Input, Form } from 'antd'
import styles from './style.module.styl'
import { getWithdrawalList, sendSmsVerifyCode, checkSmsVerifyCode, exportWithdrawal } from './api'

interface State {
  // 短信验证码
  smsCode: string
}
class Main extends React.Component<AlertComponentProps, State> {
  // 批次ID
  public batchId: number
  // 平安短信指令号
  public messageOrderNo: string
  public state: State = {
    smsCode: ''
  }
  /** 发送验证码 */
  public sendAuthCode = async (transferNo: number) => {
    const res = await sendSmsVerifyCode(transferNo);
    if (res) {
      this.batchId = res.batchId
      this.messageOrderNo = res.messageOrderNo
    }
  }
  /** 确认提现 */
  public confirmWithdraw = (record: any) => {
    this.props.alert({
      title: '提示',
      content: (
        <div>
          <div className='mb10'>本次提现总额为<span className={styles['money']}>{APP.fn.formatMoneyNumber(record.transAmount, 'm2u')}</span>元，请确认</div>
          <Form layout='inline'>
            <FormItem label='验证码'>
              <div>
                <Input
                  value={this.state.smsCode}
                  onChange={(e) => this.setState({ smsCode: e.target.value })}
                  className={styles['auth-code']}
                />
                <Button onClick={this.sendAuthCode.bind(null, record.transferNo)}>获取</Button>
              </div>
              <div>验证码已发送至您手机号{(record.memberPhone + '').replace(/(\d{3})\d{8}/, '$1********')}，请注意查收</div>
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
    dataIndex: 'id'
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
    title: '会员名称',
    width: 100,
    dataIndex: 'memberName'
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
          <div>{record.accountIdCard}</div>
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
          <div>{record.accountIdCardDesc}</div>
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
    dataIndex: 'modifyTime'
  }, {
    title: '操作',
    width: 120,
    render: (record: any) => {
      return (
        <span className='href' onClick={this.confirmWithdraw.bind(null, record.transferNo, record.memberPhone)}>确认提现</span>
      )
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
  public render () {
    return (
      <ListPage
        formConfig={getDefaultConfig()}
        addonAfterSearch={(
          <>
            <Button type='primary' onClick={this.batchExport}>批量导出</Button>
            <Button type='primary' className='ml10'>批量确认提现</Button>
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