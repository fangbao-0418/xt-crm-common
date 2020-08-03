import React from 'react'
import { ListPage, FormItem, If } from '@/packages/common/components'
import { OptionProps } from '@/packages/common/components/form'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import receiveStatus from '@/enum/receiveStatus'
import { formatFaceValue, formatDateRange } from '@/pages/helper'
import { Badge, Button, Checkbox, Empty } from 'antd'
import styles from './style.module.styl'
import * as api from '../api'

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
        label: '优惠券编号'
      },
      name: {
        type: 'input',
        label: '优惠券名称'
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
  onChange?: (selectedRowKeys: any[]) => void
  selectedRowKeys?: any[]
  onCancel?:
  | ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
  | undefined;
  onOk?: () => void
}
interface State {
  selectedRowKeys: any[]
  checked: boolean
}
class Main extends React.Component<Props, State> {
  public listpage: ListPageInstanceProps
  public defaultSelectedRowKeys = this.props.selectedRowKeys || []
  public state = {
    selectedRowKeys: this.props.selectedRowKeys || [],
    checked: false
  }
  public componentWillReceiveProps(props: Props) {
    if (props.selectedRowKeys !== this.state.selectedRowKeys) {
      this.setState({ selectedRowKeys:  props.selectedRowKeys || []})
    }
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
  public handleClickName = (record: any) => {
    const { origin, pathname } = window.location
    window.open(`${origin}${(/^\/$/).test(pathname) ? '/' : pathname}#/coupon/get/couponList/detail/${record.id}`)
  }
  public handleSelectChange = (selectedRowKeys: any) => {
    this.setState({
      selectedRowKeys
    }, () => {
      const { onChange } = this.props
      onChange && (
        onChange(selectedRowKeys)
      )
    })
  }
  public render () {
    const { selectedRowKeys, checked } = this.state
    const { readonly } = this.props
    let listPageProps = null

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
            <FormItem
              inner={(form) => {
                return (
                  <span>
                    <Checkbox checked={checked} onChange={(e) => this.setState({ checked: e.target.checked })}/>
                    <span style={{ marginLeft: 4 }}>已绑定优惠券</span>
                  </span>
                )
              }}
            />
          </>
        )
      }
    }
    if (readonly && !selectedRowKeys.length) {
      return (
        <div style={{ margin: -20 }}>
          <div className={styles['empty-coupon']}>该直播间未绑定优惠券！</div>
          <div className='ant-modal-footer'>
            <div>
              <Button type='primary' onClick={this.props.onCancel}>关闭</Button>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div style={{ margin: -20 }}>
        <ListPage
          {...listPageProps}
          onReset={() => {
            this.setState({
              checked: false
            }, () => {
              this.listpage.refresh(true)
            })
          }}
          processPayload={(payload) => {
            payload.codes = this.state.checked ? this.defaultSelectedRowKeys : []
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
            <span>{' '}已选：{selectedRowKeys.length} 张</span>
          )}
        />
        <If condition={!!readonly}>
          <div className='ant-modal-footer'>
            <div>
              <Button type='primary' onClick={this.props.onCancel}>关闭</Button>
            </div>
          </div>
        </If>
        <If condition={!readonly}>
            <div className='ant-modal-footer'>
              <div>
                <Button onClick={this.props.onCancel} >取消</Button>
                <Button type='primary' onClick={this.props.onOk}>保存设置</Button>
              </div>
            </div>
          </If>
      </div>
    )
  }
}

export default Main