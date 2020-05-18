import React from 'react'
import { Button, Tag, Modal } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { If } from '@/packages/common/components'
import { FormItem } from '@/packages/common/components/form'
import ProductCategory from './components/product-category'
import { queryConfig, RefundTypeEnum, StatusEnum, MemberTypeEnum } from './config'
import { getRefundAutoList, refundAutoAudit } from './api'
import { formatMoneyWithSign } from '../../helper'

const { confirm } = Modal

class Main extends React.Component {
  listPage: ListPageInstanceProps
  columns = [
    {
      title: '配置编号',
      dataIndex: 'serialNo'
    },
    {
      title: '配置名称',
      dataIndex: 'disposeName'
    },
    {
      title: '售后类型',
      dataIndex: 'refundTypeS',
      render: (val: any) => {
        return (
          val.map((item: any, i: number) => <Tag key={i}>{RefundTypeEnum[item]}</Tag>)
        )
      }
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
      dataIndex: 'memberTypeS',
      render: (val: any) => {
        return (
          val.map((item: any, i: number) => <Tag key={i}>{MemberTypeEnum[item]}</Tag>)
        )
      }
    },
    {
      title: '配置金额',
      dataIndex: 'refundMoney',
      render: (val: any) => formatMoneyWithSign(val)
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      render: (val: number) => StatusEnum[val] || '-'
    },
    {
      title: '操作',
      align: 'center',
      render: (record: any) => {
        return (
          <div>
            <span
              onClick={() => {
                APP.history.push(`/order/autoRefundRule/create/${record.serialNo}`)
              }}
              className='href'
            >
              查看
            </span>
            <If condition={record.status === StatusEnum['已启用']}>
              <span onClick={this.handleStop.bind(this, record, 30)} style={{ marginLeft: 8 }} className='href'>停用</span>
            </If>
            <If condition={record.status === StatusEnum['已停用']}>
              <span onClick={this.handleStart.bind(this, record, 20)} style={{ marginLeft: 8 }} className='href'>启用</span>
            </If>
            <If condition={record.status === StatusEnum['待启用']}>
              <span onClick={this.handleStart.bind(this, record, 20)} style={{ marginLeft: 8 }} className='href'>启用</span>
              <span onClick={this.handleDelete.bind(this, record, 40)} style={{ marginLeft: 8 }} className='href'>删除</span>
            </If>
          </div>
        )
      }
    }
  ]

  handleStart = (record: any, status: any) => {
    refundAutoAudit({ serialNo: record.serialNo, status })
      .then(() => {
        APP.success('启用成功')
        this.listPage.refresh()
      }, (err: any) => {
        if (err.code === '-2') {
          this.handleConfirmStart(err, record, status)
        }
      })
  }

  handleConfirmStart = (err: any, record: any, status: any) => {
    confirm({
      title: '确认启用吗?',
      content: err.message,
      onOk: () => {
        refundAutoAudit({
          serialNo: record.serialNo,
          status,
          checkStatus: 1
        }).then(() => {
          APP.success('启用成功')
          this.listPage.refresh()
        })
      }
    })
  }

  handleDelete = (record: any, status: any) => {
    confirm({
      title: '确认删除吗?',
      content: '删除之后不可恢复',
      onOk: () => {
        refundAutoAudit({
          serialNo: record.serialNo,
          status
        }).then(() => {
          APP.success('删除成功')
          this.listPage.refresh()
        })
      }
    })
  }

  handleStop = (record: any, status: any) => {
    confirm({
      title: '确认停用吗?',
      onOk: () => {
        refundAutoAudit({
          serialNo: record.serialNo,
          status
        }).then(() => {
          APP.success('停用成功')
          this.listPage.refresh()
        })
      }
    })
  }

  render () {
    return (
      <ListPage
        api={getRefundAutoList}
        getInstance={ref => this.listPage = ref}
        processPayload={({ page, categoryId, ...payload }) => {
          return {
            ...payload,
            pageNo: page,
            categoryId: categoryId ? categoryId[categoryId.length - 1] : undefined
          }
        }}
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
            <FormItem name='serialNo' />
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