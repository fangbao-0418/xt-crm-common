import React from 'react';
import { Table, Card, Button } from 'antd';
import SearchForm from './form';
import { ColumnProps } from 'antd/lib/table';
import moment from 'moment';
import { namespace } from './model';
interface State {
  list: any[]
}

function formatTime(text: any, record: GoodsCheck.ItemProps, index: number) {
  return moment(text).format('YYYY-MM-DD HH:mm:ss');
}
class Main extends React.Component<any, State> {
  public state: State = {
    list: []
  }
  public columns: ColumnProps<GoodsCheck.ItemProps>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商品',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '供货价',
      dataIndex: 'supplyPrice',
      key: 'supplyPrice',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '供应商名称',
      dataIndex: 'supplyName',
      key: 'supplyName',
    },
    {
      title: '一级类目',
      dataIndex: 'primaryCategory',
      key: 'primaryCategory',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: formatTime,
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      key: 'checkStatus',
    },
    {
      title: '审核人',
      dataIndex: 'checkPerson',
      key: 'checkPerson',
    },
    {
      title: '审核时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      render: formatTime,
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return (
          <>
            <Button type="primary">编辑</Button>
            <Button className="ml10">查看</Button>
          </>
        )
      }
    }
  ];
  public componentDidMount() {
    APP.dispatch({
      type: `${namespace}/fetchList`,
      payload: {
        cb: (list: any) => {
          this.setState({ list })
          console.log('list=>', list)
        }
      }
    })
  }
  public render() {
    return (
      <div>
        <SearchForm />
        <Card>
          <Table columns={this.columns} dataSource={this.state.list} />
        </Card>
      </div>
    );
  }
}
export default Main;
