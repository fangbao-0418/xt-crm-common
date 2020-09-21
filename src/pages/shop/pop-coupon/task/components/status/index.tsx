import React from 'react'
import classnames from 'classnames'
import styles from './style.module.styl'
interface Props {
  /** 发送状态(0: 未开始, 1: 进行中, 2: 已结束, 3: 已停止,4: 已失效) */
  status: 0 | 1 | 2 | 3 | 4
}

class Main extends React.Component<Props> {
  public render () {
    const { status } = this.props
    return (
      <div className={classnames(styles.status, styles[`status-${status}`])} >
        <span className={styles['status-point']}>●</span>
        {this.props.children}
      </div>
    )
  }
}
export default Main
