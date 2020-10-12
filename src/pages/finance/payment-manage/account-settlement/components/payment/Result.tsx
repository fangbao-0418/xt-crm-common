import React from 'react'
import { Result, Button } from 'antd'

interface Props {
  onClose?: () => void
}

class Main extends React.Component<Props> {
  public render () {
    return (
      <div>
        <Result
          status='success'
          title={(
            <span style={{ fontSize: 18 }}>
              账单支付完成，感谢您的配合
            </span>
          )}
        />
        <div className='text-center mt20'>
          <Button
            type='primary'
            onClick={this.props?.onClose}
          >
            关闭
          </Button>
        </div>
      </div>
    )
  }
}
export default Main
