import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { formatFaceValue, formatDateRange } from '@/pages/helper';
interface State {
  dataSource?: Shop.CouponProps[]
}
interface Props {
  value?: Shop.CouponProps[]
  onChange?: (value?: Shop.CouponProps[]) => void
  disabled?: boolean
}
class Main extends React.Component<Props, State> {
  public columns: ColumnProps<Shop.CouponProps>[] = [
    {title: '优惠券ID', dataIndex: 'id'},
    {title: '优惠券名称', dataIndex: 'name'},
    // {title: '每人限领次数', dataIndex: 'receiveCount'},
    {
      title: '面值', dataIndex: 'faceValue',
      render: (text, record) => formatFaceValue(record)
    },
    {
      title: '操作',
      render: (text, record) => {
        const disabled = this.props.disabled
        return (
          <div>
            {!disabled && (
              <span
                className='href'
                onClick={() => {
                  const { dataSource } = this.state
                  this.onChange(dataSource.filter((item) => item.id !== record.id))
                }}
              >
                删除
              </span>
            )}
          </div>
        )
      }
    }
  ]
  public state: State = {
    dataSource: this.props.value
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: props.value
    })
  }
  public onChange (value: Shop.CouponProps[]) {
    if (this.props.onChange) {
      this.props.onChange([...value])
    }
  }
  public render () {
    return (
      <div>
        <Table
          rowKey='id'
          dataSource={this.state.dataSource}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default Main
