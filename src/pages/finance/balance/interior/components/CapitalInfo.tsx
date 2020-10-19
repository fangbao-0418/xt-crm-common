/** 资金总计 */
import React from 'react'
import classNames from 'classnames'
import styles from './style.module.styl'
import { Row, Col, Divider, Button } from 'antd'
import * as api from '../api'
import { BalanceProfile } from '../interface'

interface StatisticProps {
  className: string
  dataSource: {title: any, description: any}[]
}
function Statistic (props: StatisticProps) {
  const { dataSource, className } = props
  return (
    <div className={classNames(styles.statistic, className)}>
      {dataSource.map((item, index) => {
        return (
          <div key={index} className={styles.item}>
            <div className={styles.title}>
              {item.title}
            </div>
            <div className={styles.description}>
              {item.description}
            </div>
            {index + 1 < dataSource.length && <div className={styles.line}></div>}
          </div>
        )
      })}
    </div>
  )
}

interface State {
  info: BalanceProfile
}

class Main extends React.Component<{}, State> {
  public state: State = {
    info: {
      /** 可提现余额 */
      cashableAmount: 0,
      /** 待结算金额 */
      unsettledAmount: 0,
      /** 冻结金额 */
      frozenAmount: 0,
      /** 已提现总额 */
      presentedAmount: 0,
      /** 累计金额 */
      totalAmount: 0
    }
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    api.fetchBalanceProfile().then((res) => {
      this.setState({
        info: res
      })
    })
  }
  public render () {
    const { info } = this.state
    return (
      <div>
        <div className={styles['capital-summary']}>
          <div className={styles.title}>
            <span style={{ fontSize: 18, fontWeight: 'bold' }}>资金总计</span>
            <span style={{ fontSize: 14, fontWeight: 'bold' }}>（元）</span>
            <span style={{ fontSize: 12, color: '#aaaaaa' }}>
              (当前数据为实时数据，可刷新页面查看最新数据)
            </span>
          </div>
          <Button type='primary' onClick={this.fetchData.bind(this)} className={styles.refresh}>刷新</Button>
        </div>
        <Statistic
          className='mt20'
          dataSource={[
            { title: '可提现余额', description: APP.fn.formatMoney(info.cashableAmount) },
            { title: '待结算金额', description: APP.fn.formatMoney(info.unsettledAmount) },
            { title: '冻结金额', description: APP.fn.formatMoney(info.frozenAmount) },
            { title: '已提现总额', description: APP.fn.formatMoney(info.presentedAmount) }
          ]}
        />
      </div>
    )
  }
}
export default Main
