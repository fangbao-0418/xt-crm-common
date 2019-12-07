import React from 'react'
import { InputNumber } from 'antd'
import { ModalProps } from './modal'

interface Props {
  modal: ModalProps,
  awardType: number,
  value?: any,
  onChange?: (result: any) => void
}
/**
 * 奖品选择
 */
class Main extends React.Component<Props, any> {
  public onChange (e: any) {
    const value = e.target ? e.tareget.value : e
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
  public render () {
    const {
      value,
      onChange,
    } = this.props
    let node
    const awardType = +this.props.awardType
    switch (awardType) {
      case 0:
        node = (
          <InputNumber
            disabled
          />
        )
        break
      /** 优惠券、实物 */
      case 1:
      case 4:
        node = (
          <div>
            <div>{value.code}</div>
            <div
              className='href'
              onClick={() => {
                this.props.modal.show({
                  success: (res: any, hide: any) => {
                    onChange && onChange(res[0])
                    hide()
                  }
                })
              }}>
              {awardType === 1? '选择优惠券': '请选择实物'}
            </div>
          </div>
        )
        break
      default:
        node = (
          <InputNumber
            value={value}
            onChange={(e) => {
              this.onChange(e)
            }}
            min={0}
            precision={0}
          />
        )
    }
    return node
  }
}

export default Main