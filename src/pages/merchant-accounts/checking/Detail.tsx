import React from 'react'
import { Button } from 'antd'
import styles from './style.module.styl'
import { FormItem } from '@/packages/common/components/form'
import ListPage from '@/packages/common/components/list-page'
import { getFieldsConfig } from './config'
import * as api from './api'
class Main extends React.Component {
  public columns = [
    {
      dataIndex: 'a',
      title: '序号'
    }, {
      dataIndex: 'a',
      title: '交易编号'
    }, {
      dataIndex: 'a',
      title: '交易类型'
    }, {
      dataIndex: 'a',
      title: '创建时间'
    }, {
      dataIndex: 'a',
      title: '完成时间'
    }, {
      dataIndex: 'a',
      title: '交易金额'
    }, {
      dataIndex: 'a',
      title: '交易状态'
    }
  ]
  public render () {
    return (
      <div className={styles.detail}>
        <div className={styles['detail-title']}>
          20191209对账单明细
        </div>
        <div className={styles['detail-header']}>
          <div>日期：20191209</div>
          <div>状态：待结算</div>
          <div>共计：25条</div>
        </div>
        <div className={styles['detail-header2']}>
          <div>
            <div>收入：<span>998.34</span>元</div>
            <div>支出：<span>99.8</span>元</div>
            <div>本期对对账单总额：<span>893.09</span>元</div>
          </div>
          <div>
            <Button type='primary'>新建调整单</Button>
          </div>
        </div>
        <ListPage
          columns={this.columns}
          api={api.fetchCheckingList}
        />
      </div>
    )
  }
}
export default Main
