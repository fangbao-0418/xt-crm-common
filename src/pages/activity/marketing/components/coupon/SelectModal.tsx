import React from 'react'
import { Table, Modal, Input, Badge, Card, Form, Button } from 'antd'
import { XtSelect } from '@/components';
import _ from 'lodash'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import receiveStatus from '@/enum/receiveStatus';
import { formatFaceValue, formatDateRange } from '@/pages/helper';
import * as api from '../../api'
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
  getInstance?: (ref?: Main) => void
  selectedRowKeys?: any[],
  onOk?: (ids: any[], rows: Coupon.CouponItemProps[]) => void
  onCancel?: () => void
  onSelect?: (record: Coupon.CouponItemProps, selected: boolean) => void
  onSelectAll?: (selected: boolean, selectedRows: Coupon.CouponItemProps[], changeRows: Coupon.CouponItemProps[]) => void
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
}
export type CouponModalInstance = Main
class Main extends React.Component<Props, State> {
  public payload: SearchPayload = {
    isDelete: 0,
    page: 1,
  }
  public state: State = {
    current: 1,
    size: 10,
    records: [],
    total: 0,
    selectedRowKeys: this.props.selectedRowKeys || [],
    visible: false
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
      width: 100,
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
  // public componentWillReceiveProps(props: Props) {
  //   this.setState({
  //     selectedRowKeys: props.selectedRowKeys || []
  //   })
  // }
  public onOk() {
    if (this.props.onOk) {
      this.props.onOk(this.state.selectedRowKeys, this.selectedRows)
      this.setState({
        visible: false
      })
    }
  }
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
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
      res.current = this.payload.page
      this.setState({ ...res })
    })
  }
  public onrowSelectionChange(selectedRowKeys: any[], selectedRows: Coupon.CouponItemProps[]) {
    this.setState({
      selectedRowKeys
    })
  }
  public onSelect (record: Coupon.CouponItemProps, selected: boolean) {
    const isExist = this.selectedRows.find((item) => item.id === record.id)
    if (selected && !isExist) {
      this.selectedRows = this.selectedRows.concat([record])
    } else if (!selected && isExist) {
      this.selectedRows = this.selectedRows.filter((item) => item.id !== record.id)
    }
    if (this.props.onSelect) {
      this.props.onSelect(record, selected)
    }
  }
  public onSelectAll (selected: boolean, selectedRows: Coupon.CouponItemProps[], changeRows: Coupon.CouponItemProps[]) {
    if (selected) {
      this.selectedRows = this.selectedRows.concat(changeRows)
    } else {
      this.selectedRows = this.selectedRows.filter((item) => {
        const index = changeRows.findIndex((val) => val.id === item.id)
        if (index !== -1) {
          changeRows = changeRows.slice(0, index).concat(changeRows.slice(index + 1, changeRows.length))
        }
        return index === -1
      })
    }
    if (this.props.onSelectAll) {
      this.props.onSelectAll(selected, selectedRows, changeRows)
    }
  }
  public onSearch(e: any) {
    this.payload.page = 1
    this.debounceFetch()
  }
  public open (value?: Marketing.PresentContentValueProps) {
    const couponList: any[] = value.couponList || []
    this.selectedRows = couponList
    this.setState({
      selectedRowKeys: couponList.map((item) => item.id),
      visible: true
    })
  }
  public debounceFetch = _.debounce(this.fetchData.bind(this), 500)
  public render() {
    const { selectedRowKeys, visible } = this.state;
    const { getFieldDecorator, resetFields } = this.props.form;
    const rowSelection = {
      onSelect: this.onSelect,
      onChange: this.onrowSelectionChange,
      onSelectAll: this.onSelectAll,
      selectedRowKeys
    }
    return (
      <Modal
        title='选择优惠券'
        visible={visible}
        width={1000}
        onOk={this.onOk}
        onCancel={() => {
          if (this.props.onCancel) {
            this.props.onCancel()
          } else {
            this.setState({
              visible: false
            })
          }
        }}
      >
        <div>
          <Card
            bordered={false}
            bodyStyle={{
              padding: 0
            }}
          >
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
                    this.fetchData()
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

export default Form.create<Props>()(Main)
