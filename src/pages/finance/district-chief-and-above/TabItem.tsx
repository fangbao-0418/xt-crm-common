import React from 'react'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig, statusEnums } from './config'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Button, Input, Form, Row } from 'antd'
import styles from './style.module.styl'

class Main extends React.Component<AlertComponentProps> {
  /** 确认提现 */
  public confirmWithdraw = () => {
    this.props.alert({
      title: '提示',
      content: (
        <div>
          <div className='mb10'>本次提现总额为<span className={styles['money']}>99999.99</span>元，请确认</div>
          <Form layout='inline'>
            <FormItem label='验证码'>
              <div>
                <Input className={styles['auth-code']} />
                <Button>获取</Button>
              </div>
              <div>验证码已发送至您手机号159xxxxxxxx，请注意查收</div>
            </FormItem>
          </Form>
        </div>
      )
    })
  }
  public columns: ColumnProps<any>[] = [{
    title: '申请单编号',
    width: 130,
    dataIndex: 'no'
  }, {
    title: '提现流水号',
    width: 130,
    dataIndex: 'serialNumber'
  }, {
    title: '金额',
    width: 70,
    dataIndex: 'momey',
    render: (text: number) => APP.fn.formatMoneyNumber(text, 'm2u')
  }, {
    title: '会员ID',
    width: 100,
    dataIndex: 'memberId'
  }, {
    title: '会员名称',
    width: 100,
    dataIndex: 'memberName'
  }, {
    title: '会员等级',
    width: 100,
    dataIndex: 'grade'
  }, {
    title: '提现账户',
    align: 'center',
    render: (record: any) => {
      return (
        <div>
          <div>王炸</div>
          <div>6222210002000198</div>
          <div>中国工商银行杭州高新支行</div>
        </div>
      )
    }
  }, {
    title: '身份信息',
    render: (record: any) => {
      return (
        <div>
          <div>王炸</div>
          <div>520103199909114956</div>
        </div>
      )
    }
  }, {
    title: '状态',
    width: 100,
    dataIndex: 'status',
    render: (text: any) => {
      return statusEnums[text]
    }
  }, {
    title: '申请时间',
    width: 120,
    dataIndex: 'applayTime',
    render: (text: any) => APP.fn.formatDate(text)
  }, {
    title: '完成时间',
    width: 120,
    dataIndex: 'finishTime'
  }, {
    title: '操作',
    width: 120,
    render: (record: any) => {
      return (
        <span className='href' onClick={this.confirmWithdraw}>确认提现</span>
      )
    }
  }, {
    title: '备注',
    width: 120,
    dataIndex: 'remark'
  }]
  public render () {
    return (
      <ListPage
        formConfig={getDefaultConfig()}
        addonAfterSearch={(
          <>
            <Button type='primary'>批量导出</Button>
            <Button type='primary' className='ml10'>批量确认提现</Button>
          </>
        )}
        columns={this.columns}
        tableProps={{
          scroll: {
            x: true
          }
        }}
        api={async () => {
          return {
            page: 1,
            total: 10,
            records: [{
              no: '998877',
              momey: 100,
              memberId: 12,
              memberName: '王炸',
              grade: '区长',
              status: '1',
              applayTime: Date.now(),
              remark: '失败原因'
            }]
          }
        }}
      />
    )
  }
}

export default Alert(Main)