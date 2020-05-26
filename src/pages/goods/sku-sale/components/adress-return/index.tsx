import React from 'react'
import SelectFetch from '@/packages/common/components/select-fetch'
import { If } from '@/packages/common/components'
import * as api from '../../api'

interface ValueProps {
  storeAddressId: string,
  storeAddressTxt: string
}

interface Props {
  value?: ValueProps
  onChange?: (value: ValueProps) => void
  readonly?: boolean
}

interface State {
  value: ValueProps
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
  public list: any[] = []
  public state: State = {
    value: {
      storeAddressId: '',
      storeAddressTxt: ''
    }
  }

  handleChange = (value: string) => {
    const { onChange } = this.props
    const curItem = this.list.find(item => item.value === value)
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
    const { value } = this.state
    const { readonly } = this.props
    console.log(value)
    if (readonly) {
      return value.storeAddressTxt || ''
    }
    return (
      <div style={{ display: 'flex' }}>
        <SelectFetch
          style={{ flex: 1 }}
          placeholder='请选择退货地址'
          value={value.storeAddressId || undefined}
          onChange={this.handleChange}
          fetchData={() => {
            return api.fetchstoreAddress().then((res = []) => {
              this.list = res.map((item: any) => ({
                label: `${item.consignee} ${item.phone} ${item.province}${item.city}${item.district}${item.street}`,
                value: item.id + ''
              }))
              return this.list
            })
          }}
        />
        <If condition={!readonly}>
          <span
            className='href ml10'
            onClick={() => APP.history.push('/goods/retaddress')}
          >
            新建退货地址
          </span>
        </If>
      </div>
    )
  }
}

export default Main