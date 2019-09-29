import React from 'react'
import classNames from 'classnames'
import styles from './style.module.sass'
interface State {
  /** 是否展开 */
  isUnfold: boolean
}
interface Props {
  rightContent?: React.ReactNode
}
class Main extends React.Component<Props, State> {
  public state: State = {
    isUnfold: true
  }
  public render () {
    const { isUnfold } = this.state
    return (
      <div className={styles.card}>
        <div className={styles.title}>
          <div className={styles['title-left']}>
            第一阶梯优惠
          </div>
          <div className={styles['title-right']}>
            {this.props.rightContent}
            <span
              className='href ml10'
              onClick={() => {
                this.setState({
                  isUnfold: !this.state.isUnfold
                })
              }}
            >
              {!isUnfold ? '展开' : '收起'}
            </span>
          </div>
        </div>
        {isUnfold && (
          <div
            className={classNames(styles.content, {[styles.unfold]: isUnfold})}
          >
            {this.props.children}
          </div>
        )}
      </div>
    )
  }
}
export default Main