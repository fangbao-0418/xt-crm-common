import React from 'react'
import { Row, Col, Radio, Input } from 'antd'
import Form, { FormItem, FormInstance } from '@/components/form'
import styles from './style.module.sass'
import CouponList from '../coupon/List'
import SkuList from '../shop/SkuList'
import ActivityList from '../activity/List'
type ValueProps = Marketing.PresentContentValueProps
interface Props {
  name: string
  /** 选择0 商品、1 优惠券 */
  onSelect?: (type: 0 | 1) => void
  value?: ValueProps
  onChange?: (value?: ValueProps) => void
  disabled?: boolean
  /** 活动状态 0-关闭, 1-未开始, 2-进行中, 3-已结束 */
  status?: 0 | 1 | 2 | 3
  giftCanEdit?: boolean
}
interface State {
  value: ValueProps
}
const defaultValue: ValueProps = {
  type: 0,
  chooseCount: 1,
  stageCount: 1,
  couponList: [],
  skuList: [],
  spuIds: {},
  spuList: []
}
/** 赠送内容 */
class Main extends React.Component<Props, State> {
  public value: ValueProps =  Object.assign({}, defaultValue, this.props.value)
  public state: State = {
    value: this.value
  }
  public componentWillReceiveProps (props: Props) {
    const value = Object.assign({}, defaultValue, props.value)
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
    const activityList = value && value.activityList || []
    const type = value.type || 0
    const { name, giftCanEdit } = this.props
    const disabled = this.props.disabled === undefined ? true : this.props.disabled
    let disabledFields = type === 1 ? ['stageCount', 'chooseCount', 'type', 'activityList'] : ['stageCount', 'chooseCount', 'type', 'couponList'] 
    disabledFields = disabled && !giftCanEdit ? ['stageCount', 'chooseCount', 'type', 'activityList', 'couponList'] : disabledFields
    disabledFields = disabled ? disabledFields : []
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
          disabled={disabledFields.indexOf('stageCount') > -1}
          name={`${name}-stageCount`}
          placeholder=''
          addonAfter={(
            <span>件</span>
          )}
        />
        <Row
          className={styles['present-content']}
        >
          <Col span={3}>
            <label className={styles.label}>赠品内容：</label>
          </Col>
          <Col span={20}>
            <FormItem
              labelCol={{span: 0}}
              style={{display: 'inline-block'}}
            >
              <Radio
                disabled={disabledFields.indexOf('type') > -1}
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
              disabled={disabledFields.indexOf('chooseCount') > -1}
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
            {(disabledFields.indexOf('activityList') === -1) && (
              <span
                className='href'
                onClick={() => {
                  if (this.props.onSelect) {
                    this.props.onSelect(0)
                  }
                }}
              >
                请选择活动
              </span>
            )}
            </div>
            <ActivityList
              disabled={disabledFields.indexOf('activityList') > -1}
              value={value}
              onChange={(value) => {
                this.value = value
                this.onChange()
              }}
            />
            {/* <SkuList
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
            /> */}
            <FormItem
              labelCol={{span: 0}}
            >
              <Radio
                disabled={disabledFields.indexOf('type') > -1}
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
              {disabledFields.indexOf('couponList') === -1 && (
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
              )}
            </div>
            <CouponList
              disabled={disabledFields.indexOf('couponList') > -1}
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
