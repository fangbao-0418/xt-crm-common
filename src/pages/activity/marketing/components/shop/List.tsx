import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Image from '@/components/Image'
import styles from './style.module.sass'
interface State {
  dataSource?: Shop.ShopItemProps[]
}
interface Props {
  disabled?: boolean
  value?: Marketing.PresentContentValueProps
  onChange?: (value: Marketing.PresentContentValueProps) => void
}
enum ShopStatusEnum {
  下架 = 0,
  上架 = 1
}
class Main extends React.Component<Props> {
  public columns: ColumnProps<Shop.ShopItemProps>[] = [
    {title: '商品ID', dataIndex: 'id'},
    {
      title: '商品名称',
      render: (item, record) => {
        return (
          <div className={styles.shop}>
            <div className={styles['shop-img']}>
              <Image
                src={record.coverUrl}
                width={80}
                height={80}
              />
            </div>
            <div className={styles['shop-right']} >
              <div>{record.productName}</div>
              <div>
                {/* {record.properties} */}
              </div>
            </div>
          </div>
        )
      }
    },
    {title: '库存', dataIndex: 'inventory'},
    // {
    //   title: '商品状态',
    //   dataIndex: 'status',
    //   render: (text) => {
    //     return ShopStatusEnum[text]
    //   }
    // },
    {
      title: '操作',
      width: 100,
      render: (text, record) => {
        if (this.props.disabled === true) { return null }
        return (
          <span
            className='href'
            onClick={() => {
              const { dataSource } = this.state
              this.onChange((dataSource || []).filter((item) => item.id !== record.id))
            }}
          >
            删除
          </span>
        )
      }
    }
  ]
  public state: State = {
    dataSource: (this.props.value && this.props.value.spuList) || []
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: (props.value && props.value.spuList) || []
    })
  }
  public onChange (row: Shop.ShopItemProps[]) {
    const value = this.props.value
    const spuIds: {[spuId: number]: number[]} = {}
    row.map((item) => {
      spuIds[item.id] = []
    })
    if (this.props.onChange) {
      this.props.onChange({
        ...value,
        spuList: row,
        spuIds
      })
    }
  }
  public render () {
    const { dataSource } = this.state
    return (
      <div>
        <Table
          className={styles['spu-list']}
          rowKey='id'
          dataSource={dataSource}
          columns={this.columns}
        />
      </div>
    )
  }
}
export default Main
