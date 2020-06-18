import React, { PureComponent } from 'react'
import styles from './style.m.styl'

interface PanelProps {
  title?: string
  subTitle?: string
  children?: React.ReactNode,
  style?: React.CSSProperties
}

class Panel extends PureComponent<PanelProps> {
  render () {
    const { title, subTitle, children } = this.props
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          {title}{' '}
          {
            subTitle
            && (
              <span className={styles.subTitle}>{subTitle}</span>
            )
          }
        </div>
        <div>
          {children}
        </div>
      </div>
    )
  }
}

export default Panel