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
  public getIdOrCodeValue (value: string) {
    value = value || ''
    return value.split(':')
  }
  public connectIdOrCode(res: {id: number, code: string}[]) {
    let result = ''
    if (res.length === 0) {
      const { id, code } = res[0]
      result = id + ':' + code
    }
    return result
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
        node = <InputNumber disabled/>
        break
      /** 优惠券、实物 */
      case 1:
      case 4:
        const [id, code] = this.getIdOrCodeValue(value)
        node = (
          code || (<span
            className='href'
            onClick={() => {
              this.props.modal.show({
                success: (res: any, hide: any) => {
                  onChange(this.connectIdOrCode(res))
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