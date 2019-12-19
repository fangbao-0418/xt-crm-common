import React from 'react'
import { Table, Input, Popconfirm, Button, Form } from 'antd'
import { ColumnProps } from 'antd/lib/table'
const FormItem = Form.Item

interface Props {
  dataSource: Shop.ShopItemProps[]
  onChange: (dataSource: Shop.ShopItemProps[]) => void
}
class Main extends React.Component<Props> {
  public pageSize = 5
  public page = 1
  public state = {
    productName: ''
  }
  public columns: ColumnProps<Shop.ShopItemProps>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      width: 100
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      width: 200
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      render: (text) => {
        return (
          <img src={text} width={80} height={80}/>
        )
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
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
  public handleSearch = (e: any) => {
    this.setState({
      productName: e.target.value
    })
  }
  public render () {
    const { productName } = this.state
    const dataSource = this.props.dataSource || []
    return (
      <>
        <Form layout='inline' className='mb10'>
          <FormItem>
            <Input
              allowClear
              value={productName}
              onChange={this.handleSearch}
              placeholder='商品搜索'
            />
          </FormItem>
          <FormItem>
            <Button type='primary'>搜索</Button>
          </FormItem>
        </Form>
        <Table
          rowKey='id'
          size={'small'}
          style={{width: '100%'}}
          columns={this.columns}
          dataSource={dataSource.filter((v: any) => v.productName.indexOf(productName) !== -1)}
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
        />
      </>
    )
  }
}
export default Main