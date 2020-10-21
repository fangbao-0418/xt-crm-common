import React from 'react'
import { Input, Button } from 'antd'
import styles from './style.module.styl'

interface State {
  num: number
  value: any
}

interface Props {
  onClick?: (cb: () => void) => void
  onChange?: (value: any) => void
  maxLength?: number
}

class Main extends React.Component<Props> {
  public state: State = {
    num: 0,
    value: ''
  }
  public timer: NodeJS.Timer
  public num = 0
  public sendCode () {
    if (this.num !== 0) {
      return
    }
    this.num = 60
    const loop = () => {
      this.num--
      this.setState({
        num: this.num
      })
      this.timer = setTimeout(() => {
        if (this.num > 0) {
          loop()
        }
      }, 1000)
    }
    loop()
  }
  public render () {
    return (
      <div className={styles.input}>
        <Input
          placeholder='请输入验证码'
          value={this.state.value}
          maxLength={this.props.maxLength}
          onChange={(e) => {
            const value = e.target.value
            if ((/^(\d+)?$/).test(value)) {
              this.setState({
                value
              })
              if (this.props.onChange) {
                this.props.onChange(Number(value))
              }
            }
          }}
        />
        {this.state.num === 0 ? (
          <Button
            className={styles.button}
            onClick={() => {
              this.props?.onClick?.(this.sendCode.bind(this))
            }}
          >
            获取
          </Button>
        ) : (
          <span className={`${styles.num} href`}>
            {this.state.num}s
          </span>
        )}
      </div>
    )
  }
}
export default Main
