import React from 'react'
import _ from 'lodash'
import CouponList from './List'
import SelectModal, { CouponModalInstance } from './SelectModal'

export interface Props {
  value?: Shop.CouponProps[]
  onChange?: (value: Shop.CouponProps[]) => void
  readonly?: boolean
}
export interface State {
  visible: boolean
}

class Main extends React.Component<Props, State> {
  public selectModal: CouponModalInstance
  public state: State = {
    visible: false
  }
  public onChange (value: Shop.CouponProps[]) {
    this.props?.onChange?.(value)
  }
  public render () {
    const value = this.props.value || []
    const { readonly } = this.props
    return (
      <div>
        <SelectModal
          getInstance={(ref) => {
            this.selectModal = ref
          }}
          onOk={(keys, rows) => {
            this.onChange(rows)
          }}
        />
        {!readonly && (
          <span
            className='href'
            onClick={() => {
              this.selectModal?.open(value)
            }}
          >
            请选择优惠券
          </span>
        )}
        <CouponList
          disabled={readonly}
          value={value}
          onChange={(vals) => {
            this.onChange(vals || [])
          }}
        />
      </div>
    )
  }
}

export default Main
