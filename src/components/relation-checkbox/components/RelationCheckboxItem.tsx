import React, { PureComponent } from 'react'
import { Checkbox, Row, Col } from 'antd'
import { isEqual, difference } from 'lodash'
import { ValueProp, ValuesProp, Option } from '../config/interface'

const CheckboxGroup = Checkbox.Group

interface RelationCheckboxItemProps {
  label: React.ReactNode
  value: ValueProp
  /* 全部显示文案 */
  labelProcess?: (value: ValuesProp) => React.ReactNode
  /* 可选择项列表 */
  options: Option[]
  labelShow?: boolean
  /* 二级label宽度 */
  lableSpan?: number
  /* 二级value宽度 */
  valueSpan?: number
  onChange?: (
    checkedItem: ValuesProp,
    checkedList: ValuesProp,
    excludeItem: ValuesProp,
    excludeValues: ValuesProp,
    key: ValueProp,
    all?: boolean
  ) => void
  /* 全部选择项 */
  values: ValuesProp
}

interface RelationCheckboxItemState {
  /* 当前选择项 */
  checkedList: ValuesProp
  indeterminate: boolean
  checkAll: boolean
  /* 全部选择项 */
  values: ValuesProp
}

class RelationCheckboxItem extends PureComponent<RelationCheckboxItemProps, RelationCheckboxItemState> {
  state = {
    checkedList: [],
    indeterminate: false,
    checkAll: false,
    values: []
  }

  static getDerivedStateFromProps (nextProps: RelationCheckboxItemProps, preState: RelationCheckboxItemState) {
    if (isEqual(nextProps.values, preState.values)) {
      return null
    }

    const { options } = nextProps
    // 获取可选择项的所有数据
    const curValues = options.map(item => item.value)
    // 所有已选项中过滤当前可选项的即为当前可选择项中的已选项
    const checkedList = nextProps.values.filter(item => curValues.includes(item))
    let checkAll
    if (options.length) {
      checkAll = checkedList.length === options.length
    } else {
      checkAll = nextProps.values.includes(nextProps.value)
    }
    return {
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < options.length,
      checkAll,
      values: nextProps.values
    }
  }

  handleItemChange = (checkedList: any[]) => {
    const { options, onChange, value } = this.props
    const curValues = options.map(item => item.value)
    const checkAll = checkedList.length === options.length
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < options.length,
      checkAll
    }, () => {
      if (typeof onChange === 'function') {
        // 获取可选择项目中没有选择的数据
        const excludeValues = difference(curValues, checkedList)
        // 获取没有选择项的数据：判断是否添加parent的value, 未选择项有的话, 需要添加parent的value 否则还是excludeValues
        const excludeItem = excludeValues.length ? [value, ...excludeValues] : excludeValues
        // 获取已经选择项的数据：判断是否全部选择, 是的话, 则添加parent的value, 否则还是checkedList
        const checkedItem = checkAll ? [value, ...checkedList] : checkedList
        onChange(checkedItem, checkedList, excludeItem, excludeValues, value)
      }
    })
  }

  handleItemAllChange = (e: any) => {
    const { options, onChange, value } = this.props
    const curValues = options.map(item => item.value)
    const checkAll = e.target.checked
    const checkedList = checkAll ? options.map(item => item.value) : []
    this.setState({
      checkedList,
      indeterminate: false,
      checkAll
    }, () => {
      if (typeof onChange === 'function') {
        const excludeValues = difference(curValues, checkedList)
        let excludeItem: ValueProp[] = []
        if (curValues.length) {
          excludeItem = excludeValues.length ? [value, ...excludeValues] : excludeValues
        } else if (checkAll) {
          excludeItem = []
        } else {
          excludeItem = [value]
        }

        const checkedItem = checkAll ? [value, ...checkedList] : checkedList
        onChange(checkedItem, checkedList, excludeItem, excludeValues, value, checkAll)
      }
    })
  }

  render () {
    const {
      options,
      label,
      labelProcess,
      labelShow = true,
      lableSpan = 2,
      valueSpan = 22
    } = this.props

    const { checkedList, checkAll, indeterminate } = this.state

    let labelStr: React.ReactNode = '全部'
    if (labelProcess) {
      labelStr = labelProcess(checkedList)
    }

    return (
      <div style={{ marginBottom: 8 }}>
        <Row>
          {
            labelShow && (
              <Col span={lableSpan}>
                <span style={{ marginRight: 4 }}>{label}</span>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={this.handleItemAllChange}
                  checked={checkAll}
                >
                  {labelStr}
                </Checkbox>
              </Col>
            )
          }
          <Col span={labelShow ? valueSpan : 24}>
            <CheckboxGroup
              options={options}
              value={checkedList}
              onChange={this.handleItemChange}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default RelationCheckboxItem
