import React, { Component } from 'react'
interface Props {
  value: number,
  interval?: number
  fontColor?: string
}
class Countdown extends Component<Props, any> {
  public timer: any
  constructor (props: any) {
    super(props)
    this.state = {
      afterRemaining: null,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    }
  }
  componentDidMount () {
    this.countFun(this.props.value)
    this.setTime(this.props.value)
  }

  //卸载组件取消倒计时
  componentWillUnmount () {
    clearInterval(this.timer)
  }

  setTime = (remaining: number) => {
    const day = Math.floor((remaining / 1000 / 3600) / 24)
    const hour = Math.floor((remaining / 1000 / 3600) % 24)
    const minute = Math.floor((remaining / 1000 / 60) % 60)
    const second = Math.floor(remaining / 1000 % 60)
    this.setState({
      afterRemaining: remaining,
      day: day,
      hour: hour < 10 ? '0' + hour : hour,
      minute: minute < 10 ? '0' + minute : minute,
      second: second < 10 ? '0' + second : second
    })
  }
  countFun = (remaining: number) => {
    this.timer = setInterval(() => {
      //防止出现负数
      if (remaining > 0) {
        remaining -= 1000
        this.setTime(remaining)
      } else {
        clearInterval(this.timer)
      }
    }, 1000)
  }
  render () {
    const { afterRemaining, day, hour, minute, second } = this.state
    return (
      <span style={{ color: 'red' }}>
        {
          this.timer ? afterRemaining < 1000 ? '超时未审核，自动完成售后' : `${hour}时${minute}分${second}秒` : ''
        }
      </span>
    )
  }
}

export default Countdown