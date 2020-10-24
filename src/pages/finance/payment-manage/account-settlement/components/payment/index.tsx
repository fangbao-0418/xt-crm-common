import React from 'react'
import { Steps, Icon } from 'antd'
import Info from './Info'
import Verify from './Verify'
import Result from './Result'
import * as api from '../../api'
import { ConfirmDataProps } from '../../interface'

const { Step } = Steps

interface Props {
  id?: any
  rows?: any[]
  onClose?: () => void
  data: ConfirmDataProps
}

interface State {
  current: 0 | 1 | 2
  phoneNumber: string
}

class Main extends React.Component<Props, State> {
  /** 短信验证码 */
  public batchId: string
  /** 平安短信指令号 */
  public messageOrderNo: string
  public smsCode: string
  public state: State = {
    current: 0,
    phoneNumber: ''
  }
  public render () {
    const { current, phoneNumber } = this.state
    const { rows, id, data } = this.props
    return (
      <div>
        <Steps current={current} labelPlacement='vertical'>
          <Step title='确认信息' icon={<Icon type='check-circle' />}>
          </Step>
          <Step title='提交验证' icon={<Icon type='check-circle' />}>
          </Step>
          <Step title='完成' icon={<Icon type='check-circle' />} />
        </Steps>
        <div>
          {current === 0 && (
            <Info
              id={this.props.id}
              rows={this.props.rows}
              data={data}
              goNext={(data) => {
                this.batchId = data.batchId
                this.setState({
                  current: 1,
                  phoneNumber: data.phoneNumber
                })
              }}
            />
          )}
          {current === 1 && (
            <Verify
              // id={this.props.id}
              phoneNumber={phoneNumber}
              onFetchCode={(cb) => {
                api.fetchPaymentVerifyCode({
                  batchId: this.batchId,
                  settlementIds: id ? [id] : (rows ? rows.map((item) => item.id) : [])
                }).then((res) => {
                  this.messageOrderNo = res.messageOrderNo
                  cb()
                })
              }}
              goNext={(code) => {
                if　(!this.messageOrderNo) {
                  APP.error('请先获取短信验证码')
                  return
                }
                if (!code) {
                  APP.error('请输入短信验证码')
                  return
                }
                if (!/^\d{6}$/.test(code)) {
                  APP.error('请输入6位有效短信验证码')
                  return
                }
                api.paymentConfirm({
                  settlementIds: id ? [id] : (rows ? rows.map((item) => item.id) : []),
                  batchId: this.batchId,
                  smsCode: code,
                  messageOrderNo: this.messageOrderNo
                }).then(() => {
                  this.setState({
                    current: 2
                  })
                })
              }}
            />
          )}
          {current === 2 && <Result onClose={this.props.onClose} />}
        </div>
      </div>
    )
  }
}
export default Main
