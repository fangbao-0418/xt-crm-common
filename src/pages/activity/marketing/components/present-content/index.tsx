import React from 'react'
import { Row, Col, Radio, Input } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import styles from './style.module.sass'
import CouponList from '../coupon/List'
import ActivityList from '../activity/List'
import ShopList from '../shop/List'
type ValueProps = Marketing.PresentContentValueProps
interface Props {
  name: string
  /** 选择0-活动、1-优惠券、2-商品 */
  onSelect?: (type: 0 | 1 | 2) => void
  value?: ValueProps
  onChange?: (value?: ValueProps) => void
  disabled?: boolean
  /** 活动状态 0-关闭, 1-未开始, 2-进行中, 3-已结束 */
  status?: 0 | 1 | 2 | 3
  giftCanEdit?: boolean
  /** ladder为阶梯规则 */
  type?: 'ladder'
  /** 类型 商品或是活动 */
  shopType: 'shop' | 'activity'
}
interface State {
  value: ValueProps
}
/** 赠送内容 */
class Main extends React.Component<Props, State> {
  public defaultValue: ValueProps = {
    type: 0,
    chooseCount: 1,
    stageCount: 1,
    couponList: [],
    skuList: [],
    spuIds: {},
    spuList: []
  }
  public value: ValueProps =  Object.assign({}, this.defaultValue, this.props.value)
  public state: State = {
    value: this.value
  }
  public componentDidMount () {
    this.onChange()
  }
  public componentWillReceiveProps (props: Props) {
    const value = Object.assign({}, this.defaultValue, props.value)
    // console.log(value, 'componentWillReceiveProps')
    this.setState({
      value
    })
    this.value = value
  }
  public onChange () {
    // console.log(this.value, 'onchange')
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
    const couponList = value && value.couponList || []
    const type = value.type || 0
    const { name, giftCanEdit } = this.props
    const disabled = this.props.disabled === undefined ? true : this.props.disabled
    let disabledFields = type === 1 ? ['stageCount', 'chooseCount', 'type', 'activityList'] : ['stageCount', 'chooseCount', 'type', 'couponList'] 
    disabledFields = disabled && !giftCanEdit ? ['stageCount', 'chooseCount', 'type', 'activityList', 'couponList'] : disabledFields
    disabledFields = disabled ? disabledFields : []
    const shopType = this.props.shopType
    return (
      <div>
        <FormItem
          style={{
            display: 'inline-block',
            marginBottom: 0
          }}
          labelCol={{span: 24}}
          wrapperCol={{span: 0}}
          required
          label='门槛'
        >
        </FormItem>
        <FormItem
          style={{
            display: 'inline-block',
            marginBottom: 0,
            width: 40
          }}
          labelCol={{span: 0}}
          required
        >
          {this.props.type === 'ladder' ? '' : '每'}满
        </FormItem>
        <FormItem
          style={{
            display: 'inline-block',
            marginLeft: 10,
            marginBottom: 0
          }}
          fieldDecoratorOptions={{
            initialValue: value.stageCount
          }}
          controlProps={{
            style: {
              width: 80,
              marginRight: 15
            },
            min: 1,
            precision: 0,
            onChange: (value: number) => {
              this.value.stageCount = value
              this.onChange()
            }
          }}
          labelCol={{span: 0}}
          wrapperCol={{span: 20}}
          addonAfterCol={{span: 4}}
          type='number'
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
              style={{
                display: 'inline-block',
                marginBottom: 0
              }}
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
              hidden={String(type) !== '0'}
              style={{
                display: 'inline-block',
                width: 140,
                marginBottom: 0
              }}
              labelCol={{span: 0}}
              wrapperCol={{span: 14}}
              addonAfterCol={{span: 4}}
              disabled={disabledFields.indexOf('chooseCount') > -1}
              type='number'
              name={`${name}-chooseCount`}
              fieldDecoratorOptions={{
                initialValue: value.chooseCount
              }}
              controlProps={{
                min: 1,
                precision: 0,
                style: {
                  width: 80,
                  marginRight: 15
                },
                onChange: (value: number) => {
                  this.value.chooseCount = value;
                  this.onChange()
                }
              }}
              placeholder=''
              addonAfter={(
                <span className='ml10'>件</span>
              )}
            />
            <div hidden={String(type) !== '0'}>
              <div>
                {(disabledFields.indexOf('activityList') === -1) && (
                  <span
                    className='href'
                    onClick={() => {
                      if (this.props.onSelect) {
                        this.props.onSelect(shopType === 'activity' ? 0 : 2)
                      }
                    }}
                  >
                    请选择{shopType === 'activity' ? '活动' : '商品'}
                  </span>
                )}
              </div>
              <If condition={shopType === 'activity'} >
                <ActivityList
                  disabled={disabledFields.indexOf('activityList') > -1}
                  value={value}
                  onChange={(value) => {
                    this.value = value
                    this.onChange()
                  }}
                />
              </If>
              <If condition={shopType === 'shop'} >
                <ShopList
                  value={value}
                  onChange={(value) => {
                    // this.value.skuList = value
                    // const spuIds: {[spuId: number]: number[]} = {}
                    // value.map((item) => {
                    //   spuIds[item.productId] = spuIds[item.productId] || []
                    //   spuIds[item.productId].push(item.skuId)
                    // })
                    // this.value.spuIds = spuIds
                    this.value = value
                    this.onChange()
                  }}
                />
              </If>
            </div>
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
            <div hidden={String(type) !== '1'}>
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
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Main
