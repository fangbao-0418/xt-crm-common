import React, { PureComponent } from 'react'
import { Button, Table } from 'antd'
import { ProductSelector, ActivitySelector } from '@/components'
import { isEqual } from 'lodash'
import { connect, unionArray } from '@/util/utils';
import { namespace } from '../model';
import { getGoodsColumns, getActivityColumns } from '../config/columns';

@connect(state => ({
  preProductRefMaps: state[namespace].preProductRefMaps,
  goodsModal: state[namespace].goodsModal,
  activityModal: state[namespace].activityModal,
}))
class ProductTable extends PureComponent {
  state = {
    productRefInfo: [],
    preProductRefInfo: []
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.preRules)) {
      return null;
    }
    const productRefInfo = nextProps.value
    return {
      productRefInfo,
      preProductRefInfo: productRefInfo
    }
  }


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

  /* 清空数据 */
  handleClear = () => {
    const { productRef, dispatch, preProductRefMaps, onChange } = this.props
    if (onChange) {
      onChange([])
    }
    dispatch[namespace].saveDefault({
      preProductRefMaps: {
        ...preProductRefMaps,
        [productRef]: []
      }
    })
  }

  /* 删除条件 */
  handleDelete = (i) => {
    const { productRefInfo } = this.state
    const { onChange } = this.props
    const newProductRefInfo = [...productRefInfo]
    newProductRefInfo.splice(i, 1)
    if (onChange) {
      onChange(newProductRefInfo)
    }
  }

  /* 商品选择器关闭 */
  handleGoodsModalCancel = () => {
    const { dispatch, goodsModal } = this.props
    dispatch[namespace].saveDefault({
      goodsModal: {
        ...goodsModal,
        visible: false
      }
    })
  }

  /* 活动选择器关闭 */
  handleActivityModalCancel = () => {
    const { dispatch, activityModal } = this.props
    dispatch[namespace].saveDefault({
      activityModal: {
        ...activityModal,
        visible: false
      }
    })
  }

  /* 选择器选择 */
  handleSelectorChange = (_, selectedRows) => {
    const { onChange } = this.props
    const { productRefInfo } = this.state
    if (onChange) {
      onChange(unionArray(productRefInfo, selectedRows))
    }
  }

  render() {
    const {
      productRef,
      goodsModal,
      activityModal,
      disabled: statusDisabled // 根据活动详情状态值计算的是否禁用值
    } = this.props
    const { productRefInfo: dataSource } = this.state

    let disabled = false
    let columns = []
    let length = dataSource.length

    let productRefTxt = '选择商品/活动'
    if (productRef === 0) {
      disabled = length >= 1 // 活动只能选择一个
      productRefTxt = '选择活动'
      columns = getActivityColumns({
        onDelete: this.handleDelete,
        statusDisabled
      })
    } else if (productRef === 1) {
      productRefTxt = '选择商品'
      columns = getGoodsColumns({
        onDelete: this.handleDelete,
        statusDisabled
      })
    } else {
      disabled = true
    }

    return (
      <div>
        {/* 选择商品模态框 */}
        <ProductSelector
          visible={goodsModal.visible}
          onCancel={this.handleGoodsModalCancel}
          onChange={this.handleSelectorChange}
        />
        {/* 选择活动模态框 */}
        <ActivitySelector
          multi={false}
          visible={activityModal.visible}
          onCancel={this.handleActivityModalCancel}
          onChange={this.handleSelectorChange}
        />
        <p>
          <Button disabled={disabled || statusDisabled} onClick={this.handleGoods} type="link">
            {productRefTxt}
          </Button>
          <span>已选择{length}条数据</span>
          <Button disabled={!length || statusDisabled} onClick={this.handleClear} type="link">
            清空
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