import React from 'react'
import SelectFetch from '@/packages/common/components/select-fetch'
import { Select } from 'antd'
import * as api from '../../api'

const { Option } = Select

interface ValueProps {
  storeAddressId: string,
  storeAddressTxt: string
}

interface Props {
  value?: ValueProps
  onChange?: (value: ValueProps) => void
  readonly?: boolean
  storeId?: number
}

interface State {
  value: ValueProps,
  list: any[]
}

class Main extends React.Component<Props, State> {
  static getDerivedStateFromProps (
    nextProps: Props
  ) {
    if (nextProps.value) {
      return {
        value: nextProps.value
      }
    }
    return null
  }
  public selectRef: any
  public state: State = {
    value: {
      storeAddressId: '',
      storeAddressTxt: ''
    },
    list: []
  }

  componentDidMount () {
    const { storeId } = this.props
    if (storeId) {
      this.fetchData(storeId)
    }
  }

  fetchData = (storeId: any) => {
    api.fetchstoreAddress({ storeId }).then((res = []) => {
      const list = res.map((item: any) => ({
        label: `${item.consignee} ${item.phone} ${item.province}${item.city}${item.district}${item.street}`,
        value: item.id + ''
      }))
      this.setState({
        list
      })
    })
  }

  handleChange = (value: string) => {
    const { onChange } = this.props
    const { list } = this.state
    const curItem = list.find(item => item.value === value)
    const val = {
      storeAddressId: value,
      storeAddressTxt: curItem.label
    }
    this.setState({
      value: val
    }, () => {
      onChange && (
        onChange(val)
      )
    })
  }

  public render () {
    const { value, list } = this.state
    const { readonly } = this.props
    if (readonly) {
      return value.storeAddressTxt || ''
    }
    return (
      <div style={{ display: 'flex' }}>
        <Select
          onChange={this.handleChange}
          value={value.storeAddressId || undefined}
          placeholder='请选择退货地址' style={{ width: 600 }}>
          {
            list.map((item) => (<Option key={item.value} value={item.value}>{item.label}</Option>))
          }
        </Select>
      </div>
    )
  }
}

export default Main