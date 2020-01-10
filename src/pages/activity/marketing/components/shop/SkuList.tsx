import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import styles from './style.module.sass'
interface State {
  dataSource: Shop.SkuProps[]
}
interface Props {
  value?: Shop.SkuProps[]
  onChange?: (value?: Shop.SkuProps[]) => void
}
class Main extends React.Component<Props> {
  public columns: ColumnProps<Shop.SkuProps>[] = [
    {title: '商品ID', dataIndex: 'skuId'},
    {
      title: '商品名称',
      render: (item, record) => {
        return (
          <div className={styles.shop}>
            <div className={styles['shop-img']}>
              <img
                src={record.coverUrl}
                width={80}
                height={80}
              />
            </div>
            <div className={styles['shop-right']} >
              <div>{record.productName}</div>
              <div>{record.properties}</div>
            </div>
          </div>
        )
      }
    },
    {title: '库存', dataIndex: 'inventory'},
    {title: '商品状态', dataIndex: 'status'},
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href'
              onClick={() => {
                const { dataSource } = this.state
                this.onChange(dataSource.filter((item) => item.skuId !== record.skuId))
              }}
            >
              删除
            </span>
          </div>
        )
      }
    }
  ]
  public state: State = {
    dataSource: this.props.value || []
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: props.value
    })
  }
  public onChange (value: Shop.SkuProps[]) {
    if (this.props.onChange) {
      this.props.onChange([...value])
    }
  }
  public render () {
    const { dataSource } = this.state
    return (
      <div className={styles['sku-list']}>
        <Table
          rowKey='skuId'
          bordered
          dataSource={dataSource}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default Main
