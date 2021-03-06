import React from 'react'
import { isEqual } from 'lodash'
import { InputNumber, message } from 'antd'

interface Props {
  style?: React.CSSProperties
  value?: any
  onChange?: (value: any) => void
}

interface State {
  leftValue?: number
  rightValue?: number
}

class Main extends React.Component<Props, State> {
  public state: State = {
    leftValue: undefined,
    rightValue: undefined
  }
  static getDerivedStateFromProps (nextProps: Props, preState: State) {
    if (!Array.isArray(nextProps.value)) {
      return {
        leftValue: undefined,
        rightValue: undefined
      }
    }
    const preValue = [preState.leftValue, preState.rightValue]
    if (isEqual(nextProps.value, preValue)) {
      return null
    }
    return {
      leftValue: nextProps.value[0],
      rightValue: nextProps.value[1]
    }
  }
  public leftChange = (leftValue: any) => {
    const { rightValue } = this.state
    if ((rightValue !== undefined) && (leftValue > rightValue)) {
      message.warn('最小值不能大于最大值')
      return
    }
    this.setState({
      leftValue
    }, () => {
      if (this.props.onChange) {
        this.props.onChange([leftValue, this.state.rightValue])
      }
    })
  }
  public righttChange = (rightValue: any) => {
    const { leftValue } = this.state
    if ((leftValue !== undefined) && (leftValue > rightValue)) {
      message.warn('最大值不能小于最小值')
      return
    }
    this.setState({
      rightValue
    }, () => {
      if (this.props.onChange) {
        this.props.onChange([this.state.leftValue, rightValue])
      }
    })
  }
  public render () {
    const { style } = this.props
    const { leftValue, rightValue } = this.state
    return (
      <div style={style}>
        <InputNumber value={leftValue} placeholder='最小金额' min={0} onChange={this.leftChange} />
        <span style={{ margin: '0 2px' }}>-</span>
        <InputNumber value={rightValue} placeholder='最大金额' min={0} onChange={this.righttChange} />
      </div>
    )
  }
}

export default Main