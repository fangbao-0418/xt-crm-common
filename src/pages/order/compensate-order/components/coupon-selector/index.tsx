import React from 'react'
import { ListPage, FormItem, If } from '@/packages/common/components'
import { OptionProps } from '@/packages/common/components/form'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import receiveStatus from '@/enum/receiveStatus'
import { formatFaceValue, formatDateRange } from '@/pages/helper'
import { Badge, Select } from 'antd'
import * as api from './api'
import { getCouponsAllList } from '../../api'

const { Option } = Select

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}

const listBadgeColors = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green'
}

const calcRatio = ({ useCount, receiveCount }: { useCount: number, receiveCount: number }) => {
  const result = useCount / receiveCount
  return (100 * result).toFixed(1) + '%'
}

const getFieldsConfig = function (partial?: FieldsConfig): FieldsConfig {
  return {
    common: {
      code: {
        type: 'input',
        label: '优惠卷编号'
      },
      name: {
        type: 'input',
        label: '优惠卷名称'
      },
      status: {
        type: 'select',
        label: '状态',
        controlProps: {
          allowClear: false
        },
        options: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '未开始',
            value: 0
          },
          {
            label: '进行中',
            value: 1
          },
          {
            label: '已结束',
            value: 2
          }
        ]
      }
    }
  }
}

interface Props {
  readonly?: boolean
  onChange?: (selectedRows: any[]) => void
  selectedRows?: any[]
}

class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public state = {
    selectedRows: this.props.selectedRows || [],
    pageKey: 'all'
  }
  public columns = [
    {
      title: '编号',
      dataIndex: 'code'
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: (text: string, record: any) => (
        <span className='href' onClick={this.handleClickName.bind(this, record)}>
          {text || '-'}
        </span>
      )
    },
    {
      title: '领取时间',
      dataIndex: 'receiveTime',
      width: 180,
      align: 'center',
      render: (text: string, record: any) => formatDateRange(record)
    },
    {
      title: '优惠券价值',
      dataIndex: 'faceValue',
      render: (text: any, record: any) => formatFaceValue(record)
    },
    {
      title: '已领取/总量',
      render: (record: any) => {
        return record.receiveCount + '/' + record.inventory
      }
    },
    {
      title: '已使用/使用率',
      render: (record: any) => {
        return record.receiveCount ? `${record.useCount} | ${calcRatio(record)}` : '-'
      }
    },
    {
      title: '领取状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (text: 0 | 1 | 2) => (
        <Badge color={listBadgeColors[text]} text={receiveStatus.getValue(text)} />
      )
    }
  ]
  public componentDidMount () {
    this.fetchCouponsAllList()
  }
  public fetchCouponsAllList = () => {
    getCouponsAllList({ orderBizType: 0 }).then(res => {
      this.setState({
        selectedRows: res || []
      })
    })
  }
  public handleClickName = (record: any) => {
    const { origin, pathname } = window.location
    window.open(`${origin}${(/^\/$/).test(pathname) ? '/' : pathname}#/coupon/get/couponList/detail/${record.id}`)
  }
  public handleSelectChange = (_: any, selectedRows: any) => {
    this.setState({
      selectedRows
    }, () => {
      const { onChange } = this.props
      onChange && (
        onChange(selectedRows)
      )
    })
  }
  public handlePageKeyChange = (pageKey: string) => {
    this.setState({
      pageKey
    }, () => {
      const { pageKey } = this.state
      this.listpage?.refresh()
      if (pageKey === 'all') {
        this.fetchCouponsAllList()
      }
    })
  }
  render () {
    const { selectedRows, pageKey } = this.state
    const { readonly } = this.props
    let listPageProps = null

    const selectedRowKeys = selectedRows.map(item => item.code)

    if (readonly) {
      listPageProps = {
        tableProps: {
          rowKey: 'code'
        }
      }
    } else {
      listPageProps = {
        tableProps: {
          rowKey: 'code',
          rowSelection: {
            selectedRowKeys,
            onChange: this.handleSelectChange,
            getCheckboxProps: (record: any) => ({
              disabled: record.status === 2
            })
          }
        },
        formConfig: getFieldsConfig(),
        formItemLayout: (
          <>
            <FormItem name='code' />
            <FormItem name='name' />
            <FormItem fieldDecoratorOptions={{ initialValue: 1 }} name='status' />
          </>
        )
      }
    }

    return (
      <div style={{ margin: '-20px' }}>
        <If condition={pageKey === 'selected'}>
          <ListPage
            tableProps={{
              rowKey: 'code'
            }}
            processPayload={(payload) => {
              return {
                ...payload,
                orderBizType: 0
              }
            }}
            getInstance={(ref) => {
              this.listpage = ref
            }}
            columns={this.columns}
            api={api.getCompensateCouponList}
            addonAfterSearch={(
              <>
                <Select
                  onChange={this.handlePageKeyChange}
                  value={pageKey}
                  style={{ width: 120 }}
                >
                  <Option value='all'>全部</Option>
                  <Option value='selected'>已选</Option>
                </Select>
              </>
            )}
          />
        </If>
        <If condition={pageKey === 'all'}>
          <ListPage
            {...listPageProps}
            processPayload={(payload) => {
              payload.orderBizType = undefined
              payload.showFlag = 0
              payload.receivePattern = 0
              if (readonly) {
                return {
                  ...payload,
                  codes: selectedRowKeys
                }
              } else {
                return payload
              }
            }}
            getInstance={(ref) => {
              this.listpage = ref
            }}
            columns={this.columns}
            api={api.getCouponList}
            addonAfterSearch={(
              <>
                <span>{' '}已选：{selectedRowKeys.length} 张</span>
                <Select
                  onChange={this.handlePageKeyChange}
                  value={pageKey}
                  style={{ width: 120, marginLeft: 24 }}
                >
                  <Option value='all'>全部</Option>
                  <Option value='selected'>已选</Option>
                </Select>
              </>
            )}
          />
        </If>
      </div>
    )
  }
}

export default Main