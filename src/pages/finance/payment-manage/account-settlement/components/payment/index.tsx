import React from 'react'
import { Steps, Icon } from 'antd'
import Info from './Info'
import Verify from './Verify'
import Result from './Result'
const { Step } = Steps

interface Props {
  id?: any
  rows?: any[]
  onClose?: () => void
}

interface State {
  current: 0 | 1 | 2
}

class Main extends React.Component<Props, State> {
  public state: State = {
    current: 0
  }
  public render () {
    const { current } = this.state
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
              goNext={() => {
                this.setState({
                  current: 1
                })
              }}
            />
          )}
          {current === 1 && (
            <Verify
              // id={this.props.id}
              goNext={() => {
                this.setState({
                  current: 2
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
