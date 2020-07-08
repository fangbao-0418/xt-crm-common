import React, { PureComponent } from 'react'
import { Button, Table } from 'antd'
import ActivitySelectModal from '@/pages/activity/marketing/components/activity/SelectModal'
import ShopSelectModal from '@/pages/activity/marketing/components/shop/SelectModal'
import { isEqual } from 'lodash'
import { connect } from '@/util/utils'
import { namespace } from '../model'
import { productCheckCost } from '../api'
import { getGoodsColumns, getActivityColumns } from '../config/columns'

@connect(state => ({
  preProductRefMaps: state[namespace].preProductRefMaps,
  goodsModal: state[namespace].goodsModal,
  activityModal: state[namespace].activityModal
}))
class ProductTable extends PureComponent {
  state = {
    productRefInfo: [],
    preProductRefInfo: []
  }

  static getDerivedStateFromProps (nextProps, preState) {
    if (isEqual(nextProps.value, preState.preProductRefInfo)) {
      return null
    }
    const productRefInfo = nextProps.value
    console.log(productRefInfo, 123)
    return {
      productRefInfo,
      preProductRefInfo: productRefInfo
    }
  }

  /* 添加活动商品操作-显示相应模态框 */
  handleGoods = () => {
    const { productRef, validateFields, promotionType } = this.props
    const { productRefInfo } = this.state
    if (!promotionType) {
      APP.error('请先选择优惠种类')
      return
    }
    if (promotionType === 15) {
      validateFields(['ruleType', 'maxDiscountsCount', 'rules', 'overlayCoupon'], (errors) => {
        if (errors) {
          return
        }
        if (productRef === 0) {
          this.activityModalInstance.open({
            activityList: productRefInfo
          })
        } else if (productRef === 1) {
          this.shopModalInstance.open({
            spuList: productRefInfo
          })
        }
      })
      return
    }

    if (productRef === 0) {
      this.activityModalInstance.open({
        activityList: productRefInfo
      })
    } else if (productRef === 1) {
      this.shopModalInstance.open({
        spuList: productRefInfo
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
  handleSelectorChange = (selectedRows) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(selectedRows)
    }
  }

  render () {
    const {
      productRef,
      rules,
      promotionType,
      disabled: statusDisabled // 根据活动详情状态值计算的是否禁用值
    } = this.props
    const { productRefInfo: dataSource } = this.state

    let disabled = false
    let columns = []
    const length = dataSource.length

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
        loseMoneyShow: promotionType === 15,
        statusDisabled
      })
    } else {
      disabled = true
    }

    return (
      <div>
        {/* 选择活动模态框 */}
        <ActivitySelectModal
          getInstance={ref => this.activityModalInstance = ref}
          onOk={rows => {
            this.activityModalInstance.hide()
            this.handleSelectorChange(rows)
          }}
        />
        {/* 选择商品模态框 */}
        <ShopSelectModal
          getInstance={ref => this.shopModalInstance = ref}
          onOk={rows => {
            const { promotionType, rule } = rules
            if (rows.length && promotionType === 15) {
              productCheckCost({ promotionType, ruleAddOrUpdateVO: rule, productIds: rows.map(item => item.id) }).then(res => {
                rows.forEach(item => {
                  const curr = res.find(rItem => rItem.productId === item.id)
                  if (curr) {
                    item.loseMoney = curr.loseMoney
                  }
                })
                this.shopModalInstance.hide()
                this.handleSelectorChange(rows)
              })
              return
            }
            console.log((99))
            this.shopModalInstance.hide()
            this.handleSelectorChange(rows)
          }}
        />
        <p>
          <Button disabled={disabled || statusDisabled} onClick={this.handleGoods} type='link'>
            {productRefTxt}
          </Button>
          <span>已选择{length}条数据</span>
          <Button disabled={!length || statusDisabled} onClick={this.handleClear} type='link'>
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