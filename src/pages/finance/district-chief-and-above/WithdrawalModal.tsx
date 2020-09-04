import React from 'react'
import { Form, Input, Button } from 'antd'
import FetchCode from '@/components/FetchCode'
import styles from './style.module.styl'
import { sendSmsVerifyCode } from './api'

const FormItem = Form.Item
interface Props {
  detail?: any
  onChange: (res: any) => void
}
interface State {
  smsCode: string
}
class Main extends React.Component<Props, State> {
  public state: State = {
    smsCode: ''
  }
  /** 发送验证码 */
  public sendAuthCode = async (cb: any) => {
    const { batchId } = this.props.detail || {}
    const res = await sendSmsVerifyCode(batchId);
    console.log('res', res)
    if (res) {
      cb()
      this.props.onChange({ batchId: res.batchId, messageOrderNo: res.messageOrderNo, smsCode: this.state.smsCode })
    }
  }
  public render() {
    const detail = this.props.detail || {}
    return (
      <div>
        <div className='mb10'>本次提现总额为<span className={styles['money']}>{APP.fn.formatMoneyNumber(detail.totalAmount, 'm2u')}</span>元，请确认</div>
        <Form layout='inline'>
          <FormItem label='验证码'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                maxLength={6}
                value={this.state.smsCode}
                onChange={(e) => this.setState({ smsCode: e.target.value })}
                className={styles['auth-code']}
              />
              <FetchCode>
              {(cb) => {
                return (
                  <Button
                    onClick={() => {
                      this.sendAuthCode(cb)
                    }}
                  >
                    获取
                  </Button>
                )
              }}
              </FetchCode>
            </div>
            <div>验证码已发送至您手机号{(detail.phone + '').replace(/(\d{3})\d{8}/, '$1********')}，请注意查收</div>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Main