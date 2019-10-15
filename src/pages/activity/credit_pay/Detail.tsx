import React from 'react'
import { Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import Form, { FormItem } from '@/packages/common/components/form'
import CostModal from './components/CostModal'
interface State {
  visible: false,
  dataSource: any[]
  costList: any[]
}
class Main extends React.Component {
  public columns: ColumnProps<any>[] = [
    {
      title: '规格名'
    },
    {
      title: '供应商SKUID'
    },
    {
      title: '销售价',
      dataIndex: 'price'
    },
    {
      title: '最大分期期数'
    },
    {
      title: '用户免息期数'
    },
    {
      title: '费用查看',
      align: 'center',
      width: 100,
      render: () => {
        return (
          <span
            className='href'
            onClick={() => {
              this.setState({
                costList: [
                  {
                    A: 'SSS'
                  }
                ],
                visible: true
              })
            }}
          >
            查看
          </span>
        )
      }
    }
  ]
  public state: State = {
    visible: false,
    costList: [],
    dataSource: [
      {
        price: 444
      }
    ]
  }
  public componentDidMount () {
    //
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFF',
          padding: 20
        }}
      >
        <Form>
          <FormItem
            label='商品名称'
          >
            ssss
          </FormItem>
          <FormItem
            label='商品类目'
          >
            ssss
          </FormItem>
          <FormItem
            label='供应商'
          >
            ssss
          </FormItem>
          <FormItem
            label='上架状态'
          >
            ssss
          </FormItem>
          <FormItem
            label='商品主图'
          >
            ssss
          </FormItem>
          <div>
            <Table
              columns={this.columns}
              dataSource={this.state.dataSource}
            />
          </div>
        </Form>
        <CostModal
          dataSource={this.state.costList}
          visible={this.state.visible}
        />
      </div>
    )
  }
}
export default Main
