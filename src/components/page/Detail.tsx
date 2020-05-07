import React from 'react'
import { Button, Divider } from 'antd'
import classNames from 'classnames'
import styles from './style.module.styl'
interface Props {
  className?: string
  title?: React.ReactNode
}

class Main extends React.Component<Props> {
  public render () {
    const { className, title } = this.props
    return (
      <div className={classNames(className, styles.detail)}>
        <div className='mb20'>
          <Button
            icon='rollback'
            type='primary'
            onClick={() => {
              APP.history.goBack()
            }}
          >
            返回
          </Button>
          {title && (
            <>
            <Divider
              style={{
                background: 'rgba(0,0,0,.1)',
                height: 16,
                margin: '0px 15px'
              }}
              type='vertical'
            />
            <span className={styles['detail-title']}>
              {title}
            </span>
            </>
          )}
        </div>
        <div className={styles.content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
export default Main
