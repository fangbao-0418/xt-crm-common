import React, { PureComponent } from 'react'
import { Checkbox, Divider } from 'antd'
import { isEqual, difference, union, intersection } from 'lodash'
import RelationCheckboxItem from './components/RelationCheckboxItem'
import { ValuesProp, Option } from './config/interface'

const getAllKeys = (options: any[]) => {
  function getAllKeysFn (options: any[]): any[] {
    return options.reduce((pre, next) => {
      return [
        ...pre,
        next.value,
        ...(getAllKeysFn(next.children || []))
      ]
    }, [])
  }
  return getAllKeysFn(options)
}

const getValues = (options: any[], value: any[]) => {
  options.forEach(item => {
    if (item.children && item.children.length) {
      const keys = item.children.map((item: any) => item.value)
      if (value.includes(item.value)) {
        value = union(value, keys)
        return
      }
      const intersectionArr = intersection(value, keys)
      if (keys.length === intersectionArr.length) {
        value = [...value, item.value]
      }
    }
  })
  return value
}

interface RelationCheckboxProps {
  /* 选项列表 */
  options: Option[]
  /* 顶部全部选项是否显示 */
  topAllSelectShow?: boolean
  /* 一级全部选项是否显示 */
  oneAllSelectShow?: boolean
  /* 顶部全部显示文案修改方法 */
  topLabelProcess?: (value: ValuesProp) => React.ReactNode
  /* 一全部显示文案修改方法 */
  oneLabelProcess?: (value: ValuesProp) => React.ReactNode
  /* 一级显示宽度比例 */
  oneSpan?: number
  /* 二级显示宽度比例 */
  twoSpan?: number
  onChange?: (values: ValuesProp) => void
  value?: ValuesProp
  /* 是否g过滤全部的id */
  filterAllIds?: boolean
  /* 是否显示划线样式 */
  divider?: boolean
}

interface RelationCheckboxState {
  indeterminate: boolean
  checkAll: boolean
  options: Option[]
  preValue: ValuesProp
  value: ValuesProp
  allKeys: ValuesProp
}

class RelationCheckbox extends PureComponent<RelationCheckboxProps, RelationCheckboxState> {
  state = {
    indeterminate: false,
    checkAll: false,
    options: [],
    preValue: [],
    value: [],
    allKeys: []
  }

  static getDerivedStateFromProps (nextProps: RelationCheckboxProps, preState: RelationCheckboxState) {
    if (nextProps.value === undefined) {
      return {
        options: nextProps.options,
        allKeys: getAllKeys(nextProps.options)
      }
    }

    if (isEqual(nextProps.value, preState.preValue)) {
      return {
        value: preState.value
      }
    }

    const allKeys = getAllKeys(nextProps.options)
    const value = getValues(nextProps.options, nextProps.value)
    const indeterminate = !!value.length && value.length < allKeys.length
    const checkAll = allKeys.length === value.length
    return {
      options: nextProps.options,
      indeterminate,
      checkAll,
      allKeys,
      value,
      preValue: value
    }
  }

  outChange = (value: ValuesProp) => {
    const { onChange, filterAllIds = true, options } = this.props
    let newValue = []
    if (!filterAllIds) {
      const oneKeys = options.filter(item => {
        if (item.children && item.children.length) {
          return true
        }
        return false
      }).map(item => item.value)
      newValue = difference(value, oneKeys)
    } else {
      newValue = value
    }
    if (onChange) {
      onChange([...newValue])
    }
  }

  handleCheckAllChange = (e: any) => {
    const { allKeys } = this.state
    const checkAll = e.target.checked
    const value = checkAll ? allKeys : []
    this.setState({
      checkAll,
      indeterminate: false,
      value
    }, () => {
      this.outChange(value)
    })
  }

  formatOptions = (options: Option[], checkAll: boolean) => {
    function formatOptionsFn (options: Option[]): Option[] {
      return options.reduce((pre: Option[], next: Option) => {
        return [
          ...pre,
          {
            ...next,
            checked: checkAll,
            ...(next.children ? { children: formatOptionsFn(next.children) } : null)
          }
        ]
      }, [])
    }
    return formatOptionsFn(options)
  }

  handleItemChange = (item: ValuesProp, _: ValuesProp, excludeItem: ValuesProp) => {
    const { value, allKeys } = this.state
    // 在已经选择项目合并子项选择的选项列表, 且排除子选项中未选择的选项列表
    const newValue = difference(union(value, item), excludeItem)
    const checkAll = newValue.length === allKeys.length
    this.setState({
      value: newValue,
      checkAll,
      indeterminate: !!newValue.length && newValue.length < allKeys.length
    }, () => {
      this.outChange(newValue)
    })
  }

  render () {
    const {
      options,
      topLabelProcess,
      oneLabelProcess,
      topAllSelectShow = true,
      oneAllSelectShow,
      oneSpan,
      twoSpan,
      divider = true
    } = this.props

    const { indeterminate, checkAll, value } = this.state

    let lebel: React.ReactNode = '全部'

    if (topLabelProcess) {
      lebel = topLabelProcess(value)
    }

    return (
      <div>
        {
          topAllSelectShow && (
            <>
              <div>
                <Checkbox
                  indeterminate={indeterminate}
                  checked={checkAll}
                  onChange={this.handleCheckAllChange}
                >
                  {lebel}
                </Checkbox>
              </div>
              {
                divider && (
                  <Divider style={{ margin: '12px 0' }} />
                )
              }
            </>
          )
        }
        {options.map((item) => (
          <RelationCheckboxItem
            key={item.value}
            labelProcess={oneLabelProcess}
            label={item.label}
            value={item.value}
            values={value}
            options={item.children || []}
            allSelectShow={oneAllSelectShow}
            oneSpan={oneSpan}
            twoSpan={twoSpan}
            onChange={this.handleItemChange}
          />
        ))}
      </div>
    )
  }
}

export default RelationCheckbox
