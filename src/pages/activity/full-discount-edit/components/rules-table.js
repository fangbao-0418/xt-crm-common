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
    const { value: dataSource, ruleType } = this.props

    let maxSize = 0
    let disabled = false

    if (ruleType === 1) { // 阶梯满 可以添加5条规则
      maxSize = 5
      disabled = dataSource.length >= 5
    } else if (ruleType === 0) { // 每满减 只可以添加1条规则
      maxSize = 1
      disabled = dataSource.length >= 1
    } else {
      disabled = true
    }

    return (
      <div>
        <p>
          <Button disabled={disabled} onClick={this.handleDiscount} type="link">
            添加条件
          </Button>
          <span>可添加最多{maxSize}个阶梯</span>
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