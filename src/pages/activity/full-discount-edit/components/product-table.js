import React, { PureComponent } from 'react'
import { Button, Table } from 'antd'
import { connect } from '@/util/utils';
import { namespace } from '../model';
import { getGoodsColumns, getActivityColumns } from '../config/columns';

@connect()
class ProductTable extends PureComponent {
  /* 添加活动商品操作-显示相应模态框 */
  handleGoods = () => {
    const { dispatch, productRef } = this.props
    if (productRef === 0) {
      dispatch[namespace].saveDefault({
        activityModal: {
          visible: true,
          title: '选择活动'
        }
      })
    } else if (productRef === 1) {
      dispatch[namespace].saveDefault({
        goodsModal: {
          visible: true,
          title: '选择商品'
        }
      })
    }
  }

  /* 删除条件 */
  handleDelete = (i) => {
    const { onDelete } = this.props
    onDelete(i)
  }

  render() {
    const { value: dataSource, productRef } = this.props

    console.log(dataSource)

    let disabled = false
    let columns = []

    let productRefTxt = '选择商品/活动'
    if (productRef === 0) {
      productRefTxt = '选择活动'
      columns = getActivityColumns({
        onDelete: this.handleDelete
      })
    } else if (productRef === 1) {
      productRefTxt = '选择商品'
      columns = getGoodsColumns({
        onDelete: this.handleDelete
      })
    } else {
      disabled = true
    }

    return (
      <div>
        <p>
          <Button disabled={disabled} onClick={this.handleGoods} type="link">
            {productRefTxt}
          </Button>
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

export default ProductTable