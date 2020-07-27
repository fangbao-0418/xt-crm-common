import React, { PureComponent } from 'react'
import { Checkbox, Divider } from 'antd'
import { isEqual, difference, union } from 'lodash'
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

interface RelationCheckboxProps {
  options: Option[]
  /* 一级全部显示文案 */
  oneLabelProcess?: (value: ValuesProp) => React.ReactNode
  /* 二级全部显示文案 */
  twoLabelProcess?: (value: ValuesProp) => React.ReactNode
  /* 一级全部显示文案是否显示 */
  oneLabelShow?: boolean
  /* 二级全部显示文案是否显示 */
  twoLabelShow?: boolean
  /* 二级label宽度 */
  lableSpan?: number
  /* 二级value宽度 */
  valueSpan?: number
  onChange?: (values: ValuesProp) => void
  value?: ValuesProp
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

    return {
      options: nextProps.options,
      allKeys: getAllKeys(nextProps.options),
      value: nextProps.value,
      preValue: nextProps.value
    }
  }

  handleCheckAllChange = (e: any) => {
    const { onChange } = this.props
    const { allKeys } = this.state
    const checkAll = e.target.checked
    const value = checkAll ? allKeys : []
    this.setState({
      checkAll,
      indeterminate: false,
      value
    }, () => {
      if (onChange) {
        onChange(value)
      }
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
    const { onChange } = this.props
    // 在已经选择项目合并子项选择的选项列表, 且排除子选项中未选择的选项列表
    const newValue = difference(union(value, item), excludeItem)
    const checkAll = newValue.length === allKeys.length
    this.setState({
      value: newValue,
      checkAll,
      indeterminate: !!newValue.length && newValue.length < allKeys.length
    }, () => {
      if (onChange) {
        onChange(newValue)
      }
    })
  }

  render () {
    const {
      options,
      oneLabelProcess,
      twoLabelProcess,
      oneLabelShow = true,
      twoLabelShow,
      lableSpan,
      valueSpan,
      divider = true
    } = this.props

    const { indeterminate, checkAll, value } = this.state

    let lebel: React.ReactNode = '全部'

    if (oneLabelProcess) {
      lebel = oneLabelProcess(value)
    }

    return (
      <div>
        {
          oneLabelShow && (
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
            labelProcess={twoLabelProcess}
            label={item.label}
            value={item.value}
            values={value}
            options={item.children || []}
            labelShow={twoLabelShow}
            lableSpan={lableSpan}
            valueSpan={valueSpan}
            onChange={this.handleItemChange}
          />
        ))}
      </div>
    )
  }
}

export default RelationCheckbox
