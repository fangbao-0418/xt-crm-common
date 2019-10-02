import React from 'react'
import Form, { FormItem, FormInstance } from '@/components/form'
import { Row, Col, Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import ShopList from '../components/shop/List'
import ShopSelectModal, { ShopModalInstance } from '../components/shop/SelectModal'
import CouponSelectModal, { CouponModalInstance } from '../components/coupon/SelectModal'
import PresentContent from '../components/present-content'
import Card from '../components/card'
import * as api from '../api'
import styles from './style.module.sass'

interface Props extends RouteComponentProps<{id: string}> {}

class Main extends React.Component<Props> {
  public shopModalInstance: ShopModalInstance
  public couponModalInstance: CouponModalInstance
  public form: FormInstance
  /** 当前选择赠品内容key */
  public presentContentSelectedKey: string
  public id: string = this.props.match.params.id
  public constructor (props: any) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    if (this.id !== '-1') {
      this.fetchData()
    }
  }
  public fetchData () {
    api.fetchActivityDetail(this.id).then((res: any) => {
      if (res) {
        this.form.setValues(res)
      }
    })
  }
  /** 选择 0-商品、1-优惠券 */
  public select (type: 0 | 1) {
    // this.presentContentSelectedKey
    const value = this.form.getValues()
    if (type === 0) {
      this.shopModalInstance.open(value[this.presentContentSelectedKey])
    } else {
      this.couponModalInstance.open()
    }
  }
  public save () {
    const value = this.form.getValues()
    console.log(value, 'save')
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
              name='activeTime'
            />
            <FormItem
              name='userScope'
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
                {/* <FormItem
                  labelCol={{span: 0}}
                  type='radio'
                  name='abc'
                  options={[{label: '指定商品', value: '1'}]}
                /> */}
                <FormItem
                  labelCol={{span: 0}}
                  inner={(form) => {
                    return form.getFieldDecorator('spuJson')(
                      <ShopList />
                    )
                  }}
                />
                {/* <FormItem
                  labelCol={{span: 0}}
                  type='radio'
                  name='abc'
                  options={[{label: '指定商品不可参与', value: '2'}]}
                />
                <Shop /> */}
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
                labelCol={{span: 4}}
                wrapperCol={{span: 20}}
                type='radio'
                name='rank.ladderRule'
                label='阶梯是否可以叠加'
                options={[
                  {label: '不可叠加', value: '0'},
                  {label: '可叠加', value: '1'}
                ]}
              />
              <Card
                rightContent={(
                  <span
                    className='href'
                    onClick={() => {

                    }}
                  >
                    删除
                  </span>
                )}
              >
                <FormItem
                  labelCol={{span: 0}}
                  inner={(form) => {
                    return form.getFieldDecorator('stair')(
                      <PresentContent
                        name='stair'
                        onSelect={(type) => {
                          this.presentContentSelectedKey = 'stair'
                          this.select(type)
                        }}
                      />
                    )
                  }}
                >
                </FormItem>
              </Card>
              <div>
                <span className='href'>+新增阶梯优惠</span>
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
            this.form.setValues({
              loop: {
                ...values.loop,
                skuList,
                spuIds: spuIds
              }
            })
            this.shopModalInstance.hide()
          }}
        />
        <CouponSelectModal
          getInstance={(ref) => {
            this.couponModalInstance = ref
          }}
          onOk={(selectedRowKeys, selectedRows) => {
            const values = this.form.getValues()
            console.log(selectedRowKeys, selectedRows, 'selectedRows')
            this.form.setValues({
              loop: {
                ...values.loop,
                couponList: selectedRows
              }
            })
          }}
        />
      </div>
    )
  }
}
export default withRouter(Main)