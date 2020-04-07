import React, { PureComponent } from 'react'
import { Card, Button, Modal } from 'antd'
import { ListPage, FormItem } from '@/packages/common/components'
import { gotoPage } from '@/util/utils';
import getColumns from './config/getColumns'
import { queryConfig } from './config/config';
import { queryDiscounts, disableDiscounts } from './api'

const { confirm } = Modal;

class FullDiscountPage extends PureComponent {
  /* 编辑 */
  handleEdit = (record) => {
    gotoPage(`/activity/full-discount/edit/${record.id}`)
  }

  /* 添加 */
  handleAdd = () => {
    gotoPage(`/activity/full-discount/edit`)
  }

  /* 详情 */
  handleDetail = (record) => {
    gotoPage(`/activity/full-discount/detail/${record.id}`)
  }

  /* 复制 */
  handleCopy = (record) => {
    gotoPage(`/activity/full-discount/copy/${record.id}`)
  }

  /* 关闭 */
  handleDisable = (record) => {
    confirm({
      content: '确认关闭该活动吗',
      onOk: () => {
        disableDiscounts({
          promotionIds: [record.id]
        })
          .then(() => {
            this.listRef.refresh()
          })
      }
    });
  }

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
              fields: ['startTime', 'endTime']
            }
          }}
          columns={getColumns({
            onDetail: this.handleDetail,
            onEdit: this.handleEdit,
            onCopy: this.handleCopy,
            onDisable: this.handleDisable
          })}
          api={queryDiscounts}
          formItemLayout={(
            <>
              <FormItem name='createTime' />
              <FormItem name='title' />
              <FormItem name='discountsStatus' />
            </>
          )}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={this.handleAdd}
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
