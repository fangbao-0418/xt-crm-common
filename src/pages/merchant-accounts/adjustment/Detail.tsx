import React from 'react'
import Adjustment from './components/Adjustment'
import Audit from './components/Audit'
import styles from './style.module.styl'
class Main extends React.Component {
  public render () {
    return (
      <div className={styles.detail}>
        <div className={styles['detail-title']}>调整单信息</div>
        <Adjustment />
        <div className={styles['detail-title']}>采购审核信息</div>
        <Audit />
      </div>
    )
  }
}
export default Main
