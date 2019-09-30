import React from 'react'
import { Row, Col, Radio, Input } from 'antd'
import Form, { FormItem, FormInstance } from '@/components/form'
import styles from './style.module.sass'
import CouponList from '../coupon/List'
import SkuList from '../shop/SkuList'
type ValueProps = Marketing.PresentContentValueProps
interface Props {
  name?: string
  /** 选择0 商品、1 优惠券 */
  onSelect?: (type: 0 | 1) => void
  value?: ValueProps
  onChange?: (value?: ValueProps) => void
}
interface State {
  value: ValueProps
}
/** 赠送内容 */
class Main extends React.Component<Props, State> {
  public value: ValueProps = {
    type: 0,
    chooseCount: 1,
    couponList: [],
    skuList: [],
    spuIds: {}
  }
  public state: State = {
    value: this.value
  }
  public componentWillReceiveProps (props: Props) {
    const value = props.value || this.value
    this.setState({
      value
    })
    this.value = value
  }
  public onChange () {
    this.setState({
      value: this.value
    })
    if (this.props.onChange) {
      this.props.onChange(this.value)
    }
  }
  public render () {
    const { value } = this.state
    const skuList = value && value.skuList || []
    const couponList = value && value.couponList || []
    const type = value.type || 0
    console.log(value, 'value')
    return (
      <Row
        className={styles['present-content']}
      >
        <Col span={2}>
          <label className={styles.label}>赠品内容：</label>
        </Col>
        <Col span={20}>
          <FormItem
            labelCol={{span: 0}}
          >
            <Radio
              checked={String(type) === '0'}
              onChange={() => {
                this.value.type = 0
                this.onChange()
              }}
            >
              实物商品
            </Radio>
          </FormItem>
          <div>
            <span
              className='href'
              onClick={() => {
                if (this.props.onSelect) {
                  this.props.onSelect(0)
                }
              }}
            >
              请选择商品
            </span>
          </div>
          <SkuList
            value={skuList}
            onChange={(value) => {
              this.value.skuList = value
              const spuIds: {[spuId: number]: number[]} = {}
              value.map((item) => {
                spuIds[item.productId] = spuIds[item.productId] || []
                spuIds[item.productId].push(item.skuId)
              })
              this.value.spuIds = spuIds
              this.onChange()
            }}
          />
          <FormItem
            labelCol={{span: 0}}
          >
            <Radio
              checked={String(type) === '1'}
              onChange={() => {
                this.value.type = 1
                this.onChange()
              }}
            >
              优惠券
            </Radio>
          </FormItem>
          <div>
            <span
              className='href'
              onClick={() => {
                if (this.props.onSelect) {
                  this.props.onSelect(1)
                }
              }}
            >
              请选择优惠券
            </span>
          </div>
          <CouponList
             value={couponList}
             onChange={(value) => {
              this.value.couponList = value
              this.onChange()
            }}
          />
        </Col>
      </Row>
    )
  }
}
export default Main
