import React from 'react'
import { ListPage, FormItem, Alert } from '@/packages/common/components'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig, promotionStatusEnum, statusArray } from './config'
import { getPromotionList, publishPromotion, closePromotion, setSort } from './api'
import { Button, Select, Modal, Input, InputNumber } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'

interface Props {
  type: string
}
interface State {
  visible: boolean
  sort?: number
}
class Main extends React.Component<Props, State> {
  public state: State = {
    visible: false
  }
  public listRef: ListPageInstanceProps
  public promotionId?: number
  /** 排序 */
  public handleSort = (sort: number, promotionId: number) => {
    this.promotionId = promotionId
    this.setState({ visible: true, sort })
  }
  public columns: ColumnProps<any>[] = [{
    title: '活动编号',
    dataIndex: 'promotionId'
  }, {
    title: '活动名称',
    dataIndex: 'title'
  }, {
    title: '报名时间',
    render: (record) => {
      return (
        <div>
          <div>{APP.fn.formatDate(record.applyStartTime) + '~'}</div>
          <div>{APP.fn.formatDate(record.applyEndTime)}</div>
        </div>
      )
    }
  }, {
    title: '预热时间',
    render: (record) => {
      if (!record.preheatStartTime || !record.preheatEndTime) {
        return '-'
      }
      return (
        <div>
          <div>{APP.fn.formatDate(record.preheatStartTime) + '~'}</div>
          <div>{APP.fn.formatDate(record.preheatEndTime)}</div>
        </div>
      )
    }
  }, {
    title: '活动排期时间',
    render: (record) => {
      return (
        <div>
          <div>{APP.fn.formatDate(record.startTime) + '~'}</div>
          <div>{APP.fn.formatDate(record.endTime)}</div>
        </div>
      )
    }
  }, {
    title: '活动状态',
    dataIndex: 'status',
    render: (text) => {
      return promotionStatusEnum[text]
    }
  }, {
    title: '店铺id',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '活动报名商品',
    render: (record) => {
      return (
        <>
          <div>全部商品：{record.productCount}个</div>
          <div>sku：{record.skuCount}个</div>
          <div>通过sku：{record.passSkuCount}个</div>
        </>
      )
    }
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '创建人',
    dataIndex: 'operator'
  }, {
    title: '操作',
    fixed: 'right',
    render: (record) => {
      return (
        <>
          {record.status === promotionStatusEnum['待发布'] && (
            <span
              className='href'
              onClick={() => {
                APP.history.push(`/shop/activity/edit?promotionId=${record.promotionId}`)
              }}
            >
              编辑
            </span>
          )}
          {/* 待发布状态显示发布，已发布进行中状态显示关闭 */}
          {record.status === promotionStatusEnum['待发布'] && (
            <span
              className='href ml10'
              onClick={this.publish.bind(null, record.venueId)}
            >发布</span>
          )}
          {[
            promotionStatusEnum['报名中'],
            promotionStatusEnum['预热中'],
            promotionStatusEnum['未开始'],
            promotionStatusEnum['进行中']
          ].includes(record.status) && (
            <span
              className='href ml10'
              onClick={this.close.bind(null, record.promotionId)}
            >关闭</span>
          )}
          <span className='href ml10' onClick={this.handleCopy.bind(null, record.promotionId)}>复制</span>
          <span
            className='href ml10'
            onClick={() => {
              APP.history.push(`/shop/activity/detail?promotionId=${record.promotionId}`)
            }}
          >查看详情</span>
          {[
            promotionStatusEnum['待发布'],
            promotionStatusEnum['已发布'],
            promotionStatusEnum['报名中'],
            promotionStatusEnum['预热中'],
            promotionStatusEnum['进行中']
          ].includes(record.status) && (
            <span
              className='href ml10'
              onClick={this.handleSort.bind(null, record.sort, record.promotionId)}
            >排序</span>
          )}
        </>
      )
    }
  }]
  // 复制
  public handleCopy = (promotionId: number) => {
    APP.history.push(`/shop/activity/add?promotionId=${promotionId}&copy=1`)
  }
  // 发布
  public publish = async (venueId: number) => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认发布？',
      onOk: async () =>{
        const res = await publishPromotion(venueId)
        if (res) {
          APP.success('发布活动成功')
          this.listRef.refresh()
        }
      }
    })
  }
  // 关闭
  public close = async (promotionId: number) => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认关闭？',
      onOk: async () => {
        const res = await closePromotion(promotionId)
        if (res) {
          APP.success('关闭活动成功')
          this.listRef.refresh()
        }
      }
    })
  }
  // 设置排序
  public onOk = async () => {
    if (!this.promotionId) {
      return
    }
    if (!this.state.sort) {
      APP.error('排序不能为空')
      return
    }
    const res = await setSort({
      promotionId: this.promotionId,
      sort: this.state.sort
    })
    if (res) {
      APP.success('设置排序成功')
      this.setState({ visible: false })
      this.listRef.refresh()
    }
  }
  public render() {
    const { visible } = this.state
    const type = this.props.type || ''
    let filters = type.split(',').map(x => +x)
    if (filters.includes(0)) {
      filters = filters.concat([1, 2, 3, 4, 5, 6, 7, 8])
    }
    const statusOption = statusArray.filter(option => filters.includes(option.value))
    return (
      <>
        <Modal
          title='编辑排序'
          visible={visible}
          onCancel={() => {
            this.promotionId = undefined
            this.setState({ visible: false, sort: undefined })
          }}
          onOk={this.onOk}
          width={400}
        >
          <InputNumber
            precision={0}
            min={1}
            max={100000}
            value={this.state.sort}
            onChange={(sort) => this.setState({ sort })}
            style={{ width: '100%' }}
          />
        </Modal>
        <ListPage
          tableProps={{
            scroll: { x: true }
          }}
          getInstance={(ref) => {
            this.listRef = ref
          }}
          formConfig={getDefaultConfig()}
          rangeMap={{
            activityTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='title' />
              <FormItem
                label='活动状态'
                inner={(form) => {
                  return form.getFieldDecorator('status')(
                    <Select style={{ width: 172 }} placeholder='请选择活动状态' allowClear>
                      {statusOption.map((item) => (
                        <Select.Option value={item.value}>{item.label}</Select.Option>
                      ))}
                    </Select>
                  )
                }}
              />
              <FormItem name='activityTime' />
              <FormItem name='promotionId' />
              <FormItem name='operator' />
            </>
          )}
          addonAfterSearch={(
            <Button
              type='primary'
              onClick={() => {
                APP.history.push('/shop/activity/add')
              }}
            >
              新建活动
            </Button>
          )}
          processPayload={(payload) => {
            if (payload.status === undefined) {
              payload.status = type
            }
            return payload
          }}
          columns={this.columns}
          api={getPromotionList}
        />
      </>
    )
  }
}

export default Main