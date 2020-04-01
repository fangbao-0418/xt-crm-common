import React, { PureComponent } from 'react'
import { Button, Table } from 'antd'
import { connect } from '@/util/utils';
import { namespace } from '../model';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

@connect(state => ({
  discountModal: state[namespace].discountModal
}))
class RulesTable extends PureComponent {
  /* 添加优惠条件操作-显示优惠模态框 */
  handleDiscount = () => {
    const { dispatch } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        visible: true,
        title: '添加优惠条件'
      }
    })
  }

  render() {
    return (
      <div>
        <p>
          <Button onClick={this.handleDiscount} type="link">
            添加条件
          </Button>
          <span>可添加最多X个阶梯</span>
        </p>
        <Table
          style={{ margin: '8px 0 8px' }}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    )
  }
}

export default RulesTable