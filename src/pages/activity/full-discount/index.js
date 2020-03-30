import React, { PureComponent } from 'react'
import { Card, Button } from 'antd'
import { ListPage, FormItem } from '@/packages/common/components'
import getColumns from './config/getColumns'
import { queryConfig } from './config/config';
import { getGoodsList } from './api'

class FullDiscountPage extends PureComponent {
  render() {
    return (
      <Card>
        <ListPage
          reserveKey='fullDiscount'
          namespace='fullDiscount'
          formConfig={queryConfig}
          getInstance={ref => this.listRef = ref}
          rangeMap={{
            createTime: {
              fields: ['createStartTime', 'createEndTime']
            }
          }}
          columns={getColumns()}
          api={getGoodsList}
          formItemLayout={(
            <>
              <FormItem name='createTime' />
              <FormItem name='activeName' />
              <FormItem name='activeStatus' />
            </>
          )}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
              >
                添加活动
              </Button>
            </div>
          )}
        />
      </Card>
    )
  }
}

export default FullDiscountPage
