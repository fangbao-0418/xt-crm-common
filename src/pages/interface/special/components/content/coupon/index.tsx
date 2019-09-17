import React from 'react'
import { Table, Input, Popconfirm } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import styles from './style.module.sass'
interface Props {
  dataSource: Coupon.CouponItemProps[]
  onChange: (dataSource: Coupon.CouponItemProps[]) => void
}
class CouponTable extends React.Component<Props> {
  public pageSize = 5
  public page = 1
  public columns: ColumnProps<Coupon.CouponItemProps>[] = [
    {
      title: '编号',
      dataIndex: 'code'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      render: (text, record, index) => {
        const { dataSource } = this.props
        // const tIndex = this.pageSize * (this.page - 1) + index
        // text = text || 0
        // if ( dataSource[tIndex]) {
        //   dataSource[tIndex].sort = dataSource[tIndex].sort || 0
        // }
        return (
          <Input
            value={text}
            onChange={(e) => {
              record.sort = Number(e.target.value || 0) || 0
              if (this.props.onChange) {
                this.props.onChange(dataSource)
              }
            }}
          />
        )
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      render: (text, record, index) => {
        const { dataSource } = this.props
        return (
          <div>
            <Popconfirm
              title="确定删除该商品吗？"
              onConfirm={() => {
                if (this.props.onChange) {
                  this.props.onChange(dataSource.filter((item) => item.id !== record.id))
                }
              }}
            >
              <span
                className="href"
              >删除</span>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  public render () {
    return (
      <Table
        rowKey='id'
        size={'small'}
        style={{width: '100%'}}
        columns={this.columns}
        dataSource={this.props.dataSource}
        pagination={{
          pageSize: this.pageSize,
          showTotal: (total) => {
            return <span>共计{total}条</span>
          },
          onChange: (page) =>  {
            console.log(page, 'page')
            this.page = page
          }
        }}
      >
      </Table>
    )
  }
}
export default CouponTable