import React from 'react'
import Form, { FormItem, FormInstance } from '@/components/form'
import { Row, Col, Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import ShopList from '../components/shop/List'
import ShopSelectModal, { ShopModalInstance } from '../components/shop/SelectModal'
import CouponSelectModal, { CouponModalInstance } from '../components/coupon/SelectModal'
import PresentContent from '../components/present-content'
import Ladder from '../components/Ladder'
import * as api from '../api'
import styles from './style.module.sass'

interface Props extends RouteComponentProps<{id: string}> {}
interface State {
  ladderCount: number
}
class Main extends React.Component<Props, State> {
  public shopModalInstance: ShopModalInstance
  public couponModalInstance: CouponModalInstance
  public form: FormInstance
  /** 当前选择赠品内容key */
  public presentContentSelectedKey: string
   /** 当前选择赠品内容索引 */
  public currentSelectIndex: number = 0
  public id: string = this.props.match.params.id
  public state: State = {
    ladderCount: 0
  }
  public constructor (props: any) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    if (this.id !== '-1') {
      this.fetchData()
    } else {
      this.initFormValue()
    }
  }
  public initFormValue () {
    this.form.setValues({
      rank: {
        ladderRule: 0,
        ruleList: [{}]
      },
      strategyType: 1
    })
  }
  public fetchData () {
    api.fetchActivityDetail(this.id).then((res: any) => {
      if (res) {
        this.form.setValues(res)
        this.setState({
          ladderCount: res.rank.ruleList.length
        })
      }
    }, () => {
      this.initFormValue()
    })
  }
  /** 选择 0-商品、1-优惠券 */
  public select (type: 0 | 1) {
    const values = this.form.getValues()
    const field = this.presentContentSelectedKey
    let value
    if (this.presentContentSelectedKey === 'rank.ruleList') {
      value = values.rank.ruleList[this.currentSelectIndex]
    } else {
      value = values[this.presentContentSelectedKey]
    }
    if (type === 0) {
      this.shopModalInstance.open(value, field === 'product' ? 'spu' : 'sku')
    } else {
      this.couponModalInstance.open(value)
    }
  }
  public save () {
    const value = this.form.getValues()
    this.form.props.form.validateFields((err) => {
      if (err) {
        APP.error('请检查输入项是否正确')
        return
      }
      if (this.id === '-1') {
        api.addActivity(value).then(() => {
          APP.success('保存成功')
        })
      } else {
        api.editActivity({
          id: this.id,
          ...value
        }).then(() => {
          APP.success('修改成功')
        })
      }
    })
  }
  public render () {
    return (
      <div
        className={styles.detail}
      >
        <Form
          namespace='marketing'
          getInstance={(ref) => {
            this.form = ref
          }}
          rangeMap={{
            activeTime: {
              fields: ['startTime', 'endTime']
            }
          }}
        >
          <div className={styles.title}>
            基本信息
          </div>
          <div>
            <FormItem
              name='title'
              verifiable
              controlProps={{
                style: {width: 300}
              }}
              placeholder='请输入活动名称，最多20个字'
            >
            </FormItem>
            <FormItem
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  {
                    validator: (rule, value, cb) => {
                      console.log(value, 'value')
                      if (!value[0] && !value[0]) {
                        cb('请选择活动时间')
                        return
                      }
                      cb()
                    }
                  }
                ]
              }}
              name='activeTime'
            />
            <FormItem
              name='userScope'
              verifiable
            />
          </div>
          <div className={styles.title}>
            活动规则
          </div>
          <div>
            <Row>
              <Col span={4} className='text-right'>
                <label className={styles.label}>活动商品：</label>
              </Col>
              <Col span={20}>
                <div>
                  <FormItem
                    labelCol={{span: 0}}
                  >
                    <span
                      className='href'
                      onClick={() => {
                        this.presentContentSelectedKey = 'product'
                        this.select(0)
                      }}
                    >
                      请选择商品
                    </span>
                  </FormItem>
                </div>
                <FormItem
                  labelCol={{span: 0}}
                  inner={(form) => {
                    return form.getFieldDecorator(
                      'product',
                      {
                        rules: [
                          {
                            validator: (rules, value, cb) => {
                              if (value && value.spuList && value.spuList.length > 0) {
                                cb()
                              } else {
                                cb('请选择活动商品')
                              }
                            }
                          }
                        ]
                      }
                    )(
                      <ShopList />
                    )
                  }}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.title}>
            赠品策略
          </div>
          <Row>
            <Col span={4} className='text-right'>
              <label className={styles.label}>赠品策略：</label>
            </Col>
            <Col span={20}>
              <FormItem
                labelCol={{span: 0}}
                type='radio'
                name='strategyType'
                options={[{label: '阶梯规则', value: 1}]}
              />
              <FormItem
                required
                labelCol={{span: 4}}
                wrapperCol={{span: 20}}
                type='radio'
                name='rank.ladderRule'
                label='阶梯是否可以叠加'
                options={[
                  {label: '不可叠加', value: 0},
                  {label: '可叠加', value: 1}
                ]}
              />
            
                <FormItem
                  labelCol={{span: 0}}
                  inner={(form) => {
                    return (
                      form.getFieldDecorator('rank.ruleList')(
                        <Ladder
                          name='rank.ruleList'
                          onSelect={(type, index) => {
                            this.presentContentSelectedKey = 'rank.ruleList'
                            this.currentSelectIndex = index
                            this.select(type)
                          }}
                          onChange={(values) => {
                            this.setState({
                              ladderCount: values.length
                            })
                          }}
                        />
                      )
                    )
                  }}
                >
                </FormItem>
              <div>
                {this.state.ladderCount < 5 && (
                  <span
                    className='href'
                    onClick={() => {
                      const values = this.form.getValues()
                      let value = values.rank.ruleList
                      value.push({})
                      this.form.setValues({
                        'rank.ruleList': value
                      })
                      this.setState({
                        ladderCount: value.length
                      })
                    }}
                  >
                    +新增阶梯优惠
                  </span>
                )}
              </div>
              <FormItem
                labelCol={{span: 0}}
                type='radio'
                name='strategyType'
                options={[{label: '循环规则', value: 0}]}
              />
              <div>
                <FormItem
                  labelCol={{span: 0}}
                  inner={(form) => {
                    return form.getFieldDecorator('loop')(
                      <PresentContent
                        name='loop'
                        onSelect={(type) => {
                          this.presentContentSelectedKey = 'loop'
                          this.select(type)
                        }}
                      />
                    )
                  }}
                >
                </FormItem>
              </div>
            </Col>
          </Row>
          <FormItem
            className='mt10'
            name='activityDescribe'
            type='textarea'
            placeholder=''
          >
          </FormItem>
          <div
            className='text-center mt20'
          >
            <Button
              type='primary'
              onClick={this.save}
            >
              保存
            </Button>
          </div>
        </Form>
        <ShopSelectModal
          getInstance={(ref) => {
            this.shopModalInstance = ref
          }}
          onOk={(rows) => {
            const skuList: Shop.SkuProps[] = []
            const spuIds: {[spuId: number]: number[]} = {}
            rows.map((item) => {
              spuIds[item.id] = []
              item.skuList.map((sku) => {
                spuIds[item.id].push(sku.skuId)
                sku.productName = item.productName
                sku.coverUrl = item.coverUrl
                sku.properties = `${item.property1 || ''}:${sku.propertyValue1 || ''} ${item.property2 || ''}:${sku.propertyValue2 || ''}`
                skuList.push(sku)
              })
            })
            const values = this.form.getValues()
            const field = this.presentContentSelectedKey
            if (field === 'rank.ruleList') {
              let value = values.rank.ruleList
              value[this.currentSelectIndex] = {
                ...value[this.currentSelectIndex],
                skuList,
                spuList: rows,
                spuIds: spuIds
              }
              this.form.setValues({
                [field]: value
              })
            } else {
              let value = {
                ...values[field],
                spuList: rows,
                skuList,
                spuIds: spuIds
              }
              console.log(value, 'value')
              this.form.setValues({
                [field]: value
              })
            }
            this.shopModalInstance.hide()
          }}
        />
        <CouponSelectModal
          getInstance={(ref) => {
            this.couponModalInstance = ref
          }}
          onOk={(selectedRowKeys, selectedRows) => {
            const values = this.form.getValues()
            const field = this.presentContentSelectedKey
            if (field === 'rank.ruleList') {
              let value = values.rank.ruleList
              value[this.currentSelectIndex] = {
                ...value[this.currentSelectIndex],
                couponList: selectedRows
              }
              this.form.setValues({
                [field]: value
              })
            } else {
              this.form.setValues({
                [field]: {
                  ...values[field],
                  couponList: selectedRows
                }
              })
            }
          }}
        />
      </div>
    )
  }
}
export default withRouter(Main)