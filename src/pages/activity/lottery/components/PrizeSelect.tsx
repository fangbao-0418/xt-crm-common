import React from 'react'
import { InputNumber, Button } from 'antd'
import { ModalProps } from './modal'

interface Props {
  modal: ModalProps,
  awardType: number,
  value?: any,
  disabled: boolean,
  onChange?: (result: any) => void
}
/**
 * 奖品选择
 */
class Main extends React.Component<Props, any> {
  public render () {
    const { onChange, value } = this.props
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
            <div>{value && value.couponName}</div>
            <div
              hidden={this.props.disabled}
              className='href'
              onClick={() => {
                this.props.modal.show({
                  success: (res: any, hide?: any) => {
                    res[0].couponName = res[0].name
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
            disabled={this.props.disabled}
            onChange={this.props.onChange}
            min={0}
            precision={0}
          />
        )
    }
    return node
  }
}

export default Main