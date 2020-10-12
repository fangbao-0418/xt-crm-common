import React from 'react'
import { Button } from 'antd'
import { FormItem } from '@/packages/common/components/form'
import AuthCodeInput from '@/components/auth-code-input'

interface Props {
  goNext?: () => void
}

class Main extends React.Component<Props> {
  public render () {
    return (
      <div>
        <div style={{ margin: '20px 40px 20px' }}>
          <div>
          温馨提示
          </div>
          1.您将收到一条由喜团合作银行平安银行发送至您手机号xxxxx的验证短信，请将正确的验证码输入验证框内，请勿向他人透露此验证码
          <br />
          2.验证码有效期2分钟，请及时处理
        </div>
        <div>
          <FormItem
            label='验证码'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
          >
            <AuthCodeInput />
          </FormItem>
        </div>
        <div className='text-center mt20'>
          <Button
            type='primary'
            onClick={this.props?.goNext}
          >
            确认无误，下一步
          </Button>
        </div>
      </div>
    )
  }
}
export default Main
