import React from 'react'
import { InputNumber } from 'antd'
import modal, { ModalProps } from './modal'

interface Props {
  modal: ModalProps,
  awardType: number,
  value: any,
  onChange: (result: any) => void
}
/**
 * 奖品选择
 */
class Main extends React.Component<Props, any> {
  public render () {
    const {
      value,
      onChange,
    } = this.props
    let node
    const awardType = +this.props.awardType
    switch (awardType) {
      case 0:
        node = <InputNumber disabled/>
        break
      /** 优惠券、实物 */
      case 1:
      case 4:
        node = (
          value.code || (<span
            className='href'
            onClick={() => {
              this.props.modal.show({
                success: (res: any, hide: any) => {
                  onChange(res[0])
                  hide()
                }
              })
            }}>
            {awardType === 1? '选择优惠券': '请选择实物'}
          </span>)
        )
        break
      default:
        node = <InputNumber/>
    }
    return node
  }
}

export default modal(Main)