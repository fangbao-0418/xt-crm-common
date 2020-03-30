import React, { PureComponent } from 'react'
import { Card } from 'antd'
import { ListPage } from '@/packages/common/components'
import { getGoodsList } from './api'


class FullDiscountPage extends PureComponent {
  columns = [
    {
      title: '商品ID',
      width: 120,
      dataIndex: 'id'
    }
  ]

  render() {
    return (
      <Card>
        <ListPage
          reserveKey='fullDiscount'
          namespace='fullDiscount'
          columns={this.columns}
          api={getGoodsList}
        />
      </Card>
    )
  }
}

export default FullDiscountPage
