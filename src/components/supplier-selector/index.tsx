import React from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { getStoreList } from './api'

const { Option } = Select
export interface SupplierItem {
  id: number;
  name: string;
}

type ValueProps = { label: string, key: any }

interface SupplierSelectProps {
  style?: React.CSSProperties
  disabled?: boolean
  onChange?: (value: ValueProps, options: SupplierItem[]) => void
  value?: ValueProps
  options?: SupplierItem[]
  category?: 5
}
interface SupplierSelectState {
  supplierList: SupplierItem[],
  fetching: boolean
}
class SupplierSelect extends React.Component<SupplierSelectProps, SupplierSelectState> {
  lastFetchId: number = 0;
  constructor (props: SupplierSelectProps) {
    super(props)
    this.state = {
      supplierList: [],
      fetching: false
    }
    this.fetchSupplier = debounce(this.fetchSupplier, 800)
  }
  UNSAFE_componentWillReceiveProps (nextProps: SupplierSelectProps) {
    if (nextProps.options && this.props.options !== nextProps.options) {
      this.setState({
        supplierList: nextProps.options
      })
    }
  }
  fetchSupplier = (name: string) => {
    const category = this.props.category
    if (name) {
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.setState({ supplierList: [], fetching: true })
      getStoreList({
        name,
        category,
        pageSize: 200
      }, { hideLoading: true })
        .then((res: any) => {
          if (fetchId !== this.lastFetchId) {
            return
          }
          this.setState({ supplierList: res.records, fetching: false })
        })
    } else {
      this.setState({
        supplierList: [],
        fetching: false
      })
    }
  }
  handleChange = (value: ValueProps) => {
    const { onChange } = this.props;
    (typeof onChange === 'function') && onChange(value, this.state.supplierList)
  }
  render () {
    const { disabled, value, style } = this.props
    const { fetching, supplierList } = this.state
    console.log(value, 'value')
    return (
      <Select
        style={style}
        disabled={disabled}
        showSearch
        onSearch={this.fetchSupplier}
        defaultActiveFirstOption={false}
        labelInValue
        showArrow={false}
        filterOption={false}
        notFoundContent={fetching ? <Spin size='small' /> : null}
        placeholder='请输入供应商名称'
        onChange={this.handleChange}
        value={value}
      >
        {supplierList.map((item: SupplierItem) => (
          <Option
            value={item.id}
            key={item.id}
            title={item.name}
          >
            {item.name}
          </Option>
        ))}
      </Select>
    )
  }
}

export default SupplierSelect