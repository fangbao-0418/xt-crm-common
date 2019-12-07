import React from 'react'
import { Table, Modal, Input, Badge, Card, Form, Button } from 'antd'
import { XtSelect } from '@/components';
import _ from 'lodash'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import receiveStatus from '@/enum/receiveStatus';
import { formatFaceValue, formatDateRange } from '@/pages/helper';
import * as api from './api'
const listBadgeColors: any = {
  '0': 'gray',
  '1': 'blue',
  '2': 'green'
}
const calcRatio = ({ useCount, receiveCount }: any) => {
  const result = useCount / receiveCount;
  return (100 * result).toFixed(1) + '%';
}
export interface Props extends FormComponentProps {
  visible?: boolean
  selectedRowKeys?: any[],
  onOk?: (ids: any[], rows: Coupon.CouponItemProps[]) => void
  onCancel: () => void
  form: any
  onSelect?: (record: Coupon.CouponItemProps, selected: boolean) => void
  onSelectAll?: (selected: boolean, selectedRows: Coupon.CouponItemProps[], changeRows: Coupon.CouponItemProps[]) => void
  type?: 'checkbox' | 'radio'
}
export interface State extends PageProps<Coupon.CouponItemProps> {
  selectedRowKeys: any[]
  visible: boolean
}
export interface SearchPayload {
  code?: string
  isDelete: 0
  name?: string
  page: number
  pageSize?: number
  status?: number
  /** 手动发券 1 是 0 否 */
  receivePattern?: 0 | 1
}
class CouponModal extends React.Component<Props, State> {
  public payload: SearchPayload = {
    isDelete: 0,
    page: 1,
    receivePattern: 0
  }
  public state: State = {
    current: 1,
    size: 10,
    records: [],
    total: 0,
    selectedRowKeys: this.props.selectedRowKeys || [],
    visible: this.props.visible || false
  }
  public selectedRows: Coupon.CouponItemProps[] = []
  public columns: ColumnProps<Coupon.CouponItemProps>[] = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '领取时间',
      dataIndex: 'receiveTime',
      key: 'receiveTime',
      render: (text, record) => formatDateRange(record)
    },
    {
      title: '优惠券价值',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      render: (text, record) => formatFaceValue(record)
    },
    {
      title: '已领取/总量',
      dataIndex: 'receiveRatio',
      key: 'receiveRatio',
      render: (text, record) => {
        return `${record.receiveCount}/${record.inventory}`
      }
    },
    {
      title: '已使用|使用率',
      dataIndex: 'usedRatio',
      key: 'usedRatio',
      render: (text, record) => {
        return record.receiveCount ? `${record.useCount} | ${calcRatio(record)}` : '-'
      }
    },
    {
      title: '领取状态',
      dataIndex: 'status',
      key: 'status',
      render: text => <Badge color={listBadgeColors[text]} text={receiveStatus.getValue(text)} />
    }
  ]
  public constructor(props: Props) {
    super(props)
    this.onOk = this.onOk.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onrowSelectionChange = this.onrowSelectionChange.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onSelectAll = this.onSelectAll.bind(this)
  }
  public componentWillReceiveProps(props: Props) {
    this.setState({
      visible: props.visible || false,
      selectedRowKeys: props.selectedRowKeys || []
    })
  }
  public onOk() {
    if (this.props.onOk) {
      this.props.onOk(this.state.selectedRowKeys, this.selectedRows)
      this.setState({
        visible: false
      })
    }
  }
  public componentDidMount() {
    this.fetchData()
  }
  public fetchData() {
    const fields = this.props.form.getFieldsValue();
    api.fetchCouponList({
      ...fields,
      ...this.payload
    }).then((res: any) => {
      res = res || {}
      res.current = this.payload.page
      this.setState({ ...res })
    })
  }
  public onrowSelectionChange(selectedRowKeys: any[]) {
    this.setState({
      selectedRowKeys
    })
  }
  public onSelect (record: Coupon.CouponItemProps, selected: boolean, selectedRows: any[]) {
    this.selectedRows = selectedRows
    if (this.props.onSelect) {
      this.props.onSelect(record, selected)
    }
  }
  public onSelectAll (selected: boolean, selectedRows: Coupon.CouponItemProps[], changeRows: Coupon.CouponItemProps[]) {
    if (this.props.onSelectAll) {
      this.props.onSelectAll(selected, selectedRows, changeRows)
    }
  }
  public onSearch() {
    this.payload.page = 1
    this.debounceFetch()
  }
  public debounceFetch = _.debounce(this.fetchData.bind(this), 500)
  public render() {
    const { selectedRowKeys, visible } = this.state;
    const { getFieldDecorator, resetFields } = this.props.form;
    const rowSelection = {
      type: this.props.type,
      onSelect: this.onSelect,
      onChange: this.onrowSelectionChange,
      onSelectAll: this.onSelectAll,
      selectedRowKeys
    }
    return (
      <Modal
        title='选择优惠券'
        visible={visible}
        width="60%"
        onOk={this.onOk}
        onCancel={this.props.onCancel}
      >
        <div>
          <Card bordered={false}>
            <Form layout="inline">
              <Form.Item label="优惠券编号">
                {getFieldDecorator('code', {})(<Input placeholder="请输入" />)}
              </Form.Item>
              <Form.Item label="优惠券名称">
                {getFieldDecorator('name', {})(<Input placeholder="请输入" />)}
              </Form.Item>
              <Form.Item label="状态">
                {getFieldDecorator('status', {})(<XtSelect data={receiveStatus.getArray('all')} style={{ width: '174px' }} placeholder="请输入" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.onSearch}>查询</Button>
                <Button
                  className="ml10"
                  onClick={() => {
                    resetFields()
                    this.onSearch()
                  }}
                >
                  重置
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Table
            style={{ width: '100%' }}
            rowKey={'id'}
            rowSelection={rowSelection}
            columns={this.columns}
            dataSource={this.state.records}
            pagination={{
              total: this.state.total,
              pageSize: this.state.size,
              current: this.state.current,
              onChange: (current) => {
                this.payload.page = current
                this.fetchData()
              }
            }}
          />
        </div>
      </Modal>
    )
  }
}

export default Form.create<Props>()(CouponModal)
