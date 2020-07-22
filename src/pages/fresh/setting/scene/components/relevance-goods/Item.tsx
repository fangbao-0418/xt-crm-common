import React from 'react'
import { Icon } from 'antd'
import styles from './style.module.styl'

interface Props {
  title?: React.ReactNode
  onRemove?: () => void
}

class Main extends React.Component<Props> {
  public render () {
    return (
      <div className={styles.item}>
        {this.props.title}
        <Icon
          className={styles.close}
          type='close'
          onClick={() => {
            this.props?.onRemove?.()
          }}
        />
      </div>
    )
  }
}
export default Main
