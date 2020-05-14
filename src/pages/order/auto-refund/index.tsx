import React from 'react'
import { Button } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { FormItem } from '@/packages/common/components/form'
import ProductCategory from './components/product-category'
import { queryConfig, RefundTypeEnum, StatusEnum, MemberTypeEnum } from './config'
import { getRefundAutoList } from './api'

class Main extends React.Component {
  list: ListPageInstanceProps
  columns = [
    {
      title: '配置编号',
      dataIndex: 'disposeId'
    },
    {
      title: '配置名称',
      dataIndex: 'disposeName'
    },
    {
      title: '售后类型',
      dataIndex: 'refundType',
      render: (val: number) => RefundTypeEnum[val] || '-'
    },
    {
      title: '一级类目',
      dataIndex: 'oneLevelName'
    },
    {
      title: '二级类目',
      dataIndex: 'twoLevelName'
    },
    {
      title: '三级类目',
      dataIndex: 'threeLevelName'
    },
    {
      title: '会员等级',
      dataIndex: 'memberType',
      render: (val: number) => MemberTypeEnum[val] || '-'
    },
    {
      title: '配置金额',
      dataIndex: 'refundMoney'
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      render: (val: number) => StatusEnum[val] || '-'
    },
    {
      title: '操作',
      align: 'center',
      render: () => {
        return (
          <div>
            <span className='href'>查看</span>
            <span style={{ marginLeft: 8 }} className='href'>停用</span>
          </div>
        )
      }
    }
  ]

  render () {
    return (
      <ListPage
        api={getRefundAutoList}
        tableProps={{
          rowKey: 'disposeId'
        }}
        formConfig={queryConfig}
        namespace='autoRefund'
        columns={this.columns}
        rangeMap={{
          createTime: {
            fields: ['createTimeStart', 'createTimeEnd']
          }
        }}
        formItemLayout={(
          <>
            <FormItem name='ruleId' />
            <FormItem name='status' />
            <FormItem
              label='商品类目'
              inner={(form) => {
                return form.getFieldDecorator('categoryId')(
                  <ProductCategory
                    style={{ width: 240 }}
                  />
                )
              }}
            />
            <FormItem name='createTime' />
          </>
        )}
        addonAfterSearch={(
          <div>
            <Button
              type='primary'
              onClick={() => {
                APP.history.push(
                  '/order/autoRefundRule/create'
                )
              }}
            >
              新增配置
            </Button>
          </div>
        )}
      />
    )
  }
}

export default Main