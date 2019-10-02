import React from 'react'
import { Row, Col, Radio, Input } from 'antd'
import Form, { FormItem, FormInstance } from '@/components/form'
import styles from './style.module.sass'
import CouponList from '../coupon/List'
import SkuList from '../shop/SkuList'
type ValueProps = Marketing.PresentContentValueProps
interface Props {
  name: string
  /** 选择0 商品、1 优惠券 */
  onSelect?: (type: 0 | 1) => void
  value?: ValueProps
  onChange?: (value?: ValueProps) => void
}
interface State {
  value: ValueProps
}
const defaultValue: ValueProps = {
  type: 0,
  chooseCount: 0,
  couponList: [],
  skuList: [],
  spuIds: {}
}
/** 赠送内容 */
class Main extends React.Component<Props, State> {
  public value: ValueProps =  Object.assign({}, defaultValue, this.props.value)
  public state: State = {
    value: this.value
  }
  public componentWillReceiveProps (props: Props) {
    const value = Object.assign({}, defaultValue, props.value)
    console.log(value, 'value')
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
      this.props.onChange({
        ...this.value
      })
    }
  }
  public render () {
    const { value } = this.state
    const skuList = value && value.skuList || []
    const couponList = value && value.couponList || []
    const type = value.type || 0
    const { name } = this.props
    return (
      <div>
        <FormItem
          style={{
            display: 'inline-block'
          }}
          labelCol={{span: 24}}
          wrapperCol={{span: 0}}
          required
          label='门槛'
        >
        </FormItem>
        <FormItem
          style={{
            display: 'inline-block'
          }}
          labelCol={{span: 0}}
          required
        >
          每满
        </FormItem>
        <FormItem
          style={{
            display: 'inline-block',
            marginLeft: 10
          }}
          fieldDecoratorOptions={{
            initialValue: value.stageCount
          }}
          controlProps={{
            style: {
              width: 50,
              marginRight: 5
            },
            onChange: (e: any) => {
              this.value.stageCount = e.target.value
              this.onChange()
            }
          }}
          labelCol={{span: 0}}
          wrapperCol={{span: 20}}
          addonAfterCol={{span: 4}}
          type='input'
          name={`${name}-stageCount`}
          placeholder=''
          addonAfter={(
            <span>件</span>
          )}
        />
        <Row
          className={styles['present-content']}
        >
          <Col span={2}>
            <label className={styles.label}>赠品内容：</label>
          </Col>
          <Col span={20}>
            <FormItem
              labelCol={{span: 0}}
              style={{display: 'inline-block'}}
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
            <FormItem
              style={{
                display: 'inline-block',
                width: 80,
              }}
              labelCol={{span: 0}}
              wrapperCol={{span: 14}}
              addonAfterCol={{span: 4}}
              type='input'
              name={`${name}-chooseCount`}
              fieldDecoratorOptions={{
                initialValue: value.chooseCount
              }}
              controlProps={{
                onChange: (e: any) => {
                  this.value.chooseCount = e.target.value
                  this.onChange()
                }
              }}
              placeholder=''
              addonAfter={(
                <span className='ml10'>件</span>
              )}
            />
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
      </div>
    )
  }
}
export default Main
