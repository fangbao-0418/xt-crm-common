import React, { PureComponent } from 'react'
import { Button, Table } from 'antd'
import { isEqual } from 'lodash'
import { connect } from '@/util/utils';
import { namespace } from '../model';
import { getRulesColumns } from '../config/columns';
import DiscountModal from './discount-modal'

@connect(state => ({
  currentRuleIndex: state[namespace].currentRuleIndex,
  preRulesMaps: state[namespace].preRulesMaps
}))
class RulesTable extends PureComponent {
  state = {
    rules: [],
    preRules: []
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.preRules)) {
      return null;
    }
    const rules = nextProps.value
    return {
      rules,
      preRules: rules
    }
  }

  /* 保存规则 */
  handleRulesSave = (record) => {
    const { rules } = this.state
    const { onChange, currentRuleIndex } = this.props
    if (currentRuleIndex >= 0) {
      rules.splice(currentRuleIndex, 1, record)
    } else {
      rules.push(record)
    }
    if (onChange) {
      onChange(rules)
    }
  }

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
    const { dispatch } = this.props
    dispatch[namespace].saveDefault({
      discountModal: {
        visible: true,
        title: `编辑第【${i + 1}】条规则`
      },
      currentRuleIndex: i
    })
  }

  /* 删除条件 */
  handleDelete = (i) => {
    const { rules } = this.state
    const { onChange } = this.props
    const newRules = [...rules]
    newRules.splice(i, 1)
    if (onChange) {
      onChange(newRules)
    }
  }

  /* 清空数据 */
  handleClear = () => {
    const { promotionType, ruleType, dispatch, preRulesMaps, onChange } = this.props
    if (onChange) {
      onChange([])
    }
    dispatch[namespace].saveDefault({
      preRulesMaps: {
        ...preRulesMaps,
        [`${promotionType}-${ruleType}`]: []
      }
    })
  }

  render() {
    const { value: dataSource, promotionType, ruleType } = this.props
    const { rules } = this.state

    let maxSize = 0
    let disabled = true
    let length = dataSource.length

    if (ruleType === 1) { // 阶梯满 可以添加5条规则
      maxSize = 5
      disabled = length >= 5
    } else if (ruleType === 0) { // 每满减 只可以添加1条规则
      maxSize = 1
      disabled = length >= 1
    }

    return (
      <div>
        {/* 优惠条件模态框 */}
        <DiscountModal
          promotionType={promotionType}
          rules={rules}
          onOk={this.handleRulesSave}
        />
        <p>
          <Button
            disabled={disabled || (!promotionType)}
            onClick={this.handleDiscount} type="link"
          >
            添加条件
          </Button>
          <span>可添加最多{maxSize}个阶梯</span>
          <Button disabled={!length} onClick={this.handleClear} type="link">
            清空
          </Button>
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