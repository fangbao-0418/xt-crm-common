import React, { PureComponent } from 'react'
import { Button, Table } from 'antd'
import { connect } from '@/util/utils';
import { namespace } from '../model';
import { getRulesColumns } from '../config/columns';

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

  /* 编辑条件 */
  handleEdit = (i) => {
    const { onEdit } = this.props
    onEdit(i)
  }

  /* 删除条件 */
  handleDelete = (i) => {
    const { onDelete } = this.props
    onDelete(i)
  }

  render() {
    const { value: dataSource } = this.props

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
          columns={getRulesColumns({
            onEdit: this.handleEdit,
            onDelete: this.handleDelete
          })}
        />
      </div>
    )
  }
}

export default RulesTable