import React from 'react'
import { Icon } from 'antd'
import styles from './style.module.sass'
interface Props {
  type?: 'up' | 'down'
  onClick?: (dict: 'up' | 'down') => void
}
interface State {
  visible: boolean
}
class Main extends React.Component<Props, State> {
  public state: State = {
    visible: false
  }
  public handleClick (dict: 'up' | 'down') {
    if (this.props.onClick) {
      this.props.onClick(dict)
    }
  }
  public render () {
    const type = this.props.type
    return (
      <div
        className={styles['arrow-contain']}
        onMouseEnter={() => {
          this.setState({
            visible: true
          })
        }}
        onMouseLeave={() => {
          this.setState({
            visible: false
          })
        }}
      >
        <div
        >
          {this.props.children}
        </div>
        <div
          className={styles.arrows}
          style={{
            visibility: !this.state.visible ? 'hidden' : 'unset'
          }}
        >
          {type !== 'down' && (
            <Icon
              type="arrow-up"
              onClick={() => {
                this.handleClick('up')
              }}
            />
          )}
          {type !== 'up' && (
            <Icon
              type="arrow-down"
              onClick={() => {
                this.handleClick('down')
              }}
            />
          )}
        </div>
      </div>
    )
  }
}
export default Main
