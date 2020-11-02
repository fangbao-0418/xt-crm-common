import React from 'react'
import styles from '../index.module.scss';

interface Props {
  data: any
}

class Main extends React.Component<Props> {
  public render () {
    const data = this.props.data || {}
    return (
      <div>
        <div className={styles.income}>
          <div className={styles.content}>
            <span className={styles.key}>总收益：</span>
            <span>{data.totalAccount ? data.totalAccount / 100 : 0}</span>
          </div>
          <div className={styles.content}>
            <span className={styles.key}>余额：</span>
            <span>{data.alreadyAccount ? data.alreadyAccount / 100 : 0}</span>
          </div>
          <div className={styles.content}>
            <span className={styles.key}>待到账：</span>
            <span>{data.stayAccount ? data.stayAccount / 100 : 0}</span>
          </div>
          <div className={styles.content}>
            <span className={styles.key}>冻结中：</span>
            <span>{data.freezeAccount ? data.freezeAccount / 100 : 0}</span>
          </div>
          <div className={styles.content}>
            <span className={styles.key}>已提现：</span>
            <span>{data.presentedAccount ? data.presentedAccount / 100 : 0}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default Main
