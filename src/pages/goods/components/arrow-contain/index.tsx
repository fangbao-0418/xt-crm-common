import React from 'react'
import { Icon } from 'antd'
import styles from './style.module.sass'
interface Props {
  type?: 'up' | 'down'
  onClick?: (dict: 'up' | 'down') => void
}
class Main extends React.Component<Props> {
  public handleClick (dict: 'up' | 'down') {
    if (this.props.onClick) {
      this.props.onClick(dict)
    }
  }
  public render () {
    const type = this.props.type
    return (
      <div className={styles['arrow-contain']}>
        <div>
          {this.props.children}
        </div>
        <div className={styles.arrows}>
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
