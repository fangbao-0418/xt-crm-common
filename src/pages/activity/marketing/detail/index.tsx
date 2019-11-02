import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { Row, Col, Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import ActivityList from '../components/activity/List'
import ActivitySelectModal, { ShopModalInstance } from '../components/activity/SelectModal'
import CouponSelectModal, { CouponModalInstance } from '../components/coupon/SelectModal'
import PresentContent from '../components/present-content'
import Ladder from '../components/Ladder'
import * as api from '../api'
import styles from './style.module.sass'

interface Props extends RouteComponentProps<{id: string, type: 'view' | 'edit'}> {}
interface State {
  ladderCount: number
  loading: boolean
  disabled: boolean
  canSave: boolean
  values: Marketing.FormDataProps
  /** 赠品是否可编辑 */
  giftCanEdit: boolean
}
class Main extends React.Component<Props, State> {
  public ActivityModalInstance: ShopModalInstance
  public couponModalInstance: CouponModalInstance
  public form: FormInstance
  /** 当前选择赠品内容key */
  public presentContentSelectedKey: string
   /** 当前选择赠品内容索引 */
  public currentSelectIndex: number = 0
  public id: string = this.props.match.params.id
  public type: 'view' | 'edit' = this.props.match.params.type
  public state: State = {
    ladderCount: 0,
    loading: false,
    disabled: true,
    canSave: false,
    values: {},
    giftCanEdit: false
  }
  public constructor (props: any) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    if (this.id !== '-1') {
      this.fetchData()
    } else {
      this.setState({
        disabled: false,
        canSave: true
      })
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
          values: res,
          ladderCount: res.rank.ruleList.length,
          disabled: (this.type !== 'edit' || [1].indexOf(res.discountsStatus) === -1),
          canSave: (this.type === 'edit' && [1, 2].indexOf(res.discountsStatus) > -1),
          giftCanEdit: this.type === 'edit'
        })
      }
    }, (e) => {
      this.initFormValue()
      this.setState({
        disabled: true
      })
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
      this.ActivityModalInstance.open(value)
    } else {
      this.couponModalInstance.open(value)
    }
  }
  /** 校验规则内容 返回true校验通过 */
  public validatePresent (data: Marketing.FormDataProps) {
    let arr: Marketing.PresentContentValueProps[] = []
    const nums = ['一', '二', '三', '四', '五']
    const ruleType = data.strategyType
    let message = ''
    let type = ''
    if (ruleType === 0) {
      type = '循环规则'
      arr = data.loop ? [data.loop] : []
    } else {
      arr = data.rank ? (data.rank.ruleList || []) : []
      type = '阶梯规则'
      let stageCount = 0
      const stageIndex = arr.findIndex((item) => {
        if ((item.stageCount || 0) <= stageCount) {
          return true
        } else {
          stageCount = item.stageCount as number
          return false
        }
      })
      if (stageIndex > -1) {
        APP.error(`第${nums[stageIndex]}阶梯门槛不能小于上一阶梯门槛`)
        return false
      }
    }
    console.log(data, arr, ruleType, 'arr')
    const index = arr.findIndex((item, index) => {
      if (ruleType !== 0) {
        type = `第${nums[index]}阶梯规则`
      } else {
        type = '循环规则'
      }
      if (!item.stageCount) {
        message = '请输入满足门槛件数'
        return true
      }
      if (item.type === 0) {
        if (!item.chooseCount) {
          message = '请输入实物商品件数'
          return true
        } else if (!item.activityList || item.activityList && item.activityList.length === 0) {
          message = '请选择活动商品'
          return true
        }
      } else if (item.type === 1) {
        if (!item.couponList || item.couponList && item.couponList.length === 0) {
          message = '请选择优惠券'
          return true
        }
      }
    })

    if (arr.length === 0) {
      APP.error(type + '不能为空')
      return false
    }
    if (index > -1) {
      APP.error(type + message)
    }
    return index === -1
  }
  public save () {
    const value = this.form.getValues()
    this.form.props.form.validateFields((err) => {
      if (err) {
        APP.error('请检查输入项是否正确')
        return
      }
      if (!this.validatePresent(value)) {
        return
      }
      this.setState({
        loading: true
      })
      if (this.id === '-1') {
        api.addActivity(value).then(() => {
          APP.success('保存成功')
          this.setState({
            loading: false
          }, () => {
            APP.history.push('/activity/marketing')
          })
        }, () => {
          this.setState({
            loading: false
          })
        })
      } else {
        api.editActivity({
          id: this.id,
          ...value
        }).then(() => {
          APP.success('修改成功')
          this.setState({
            loading: false
          }, () => {
            APP.history.push('/activity/marketing')
          })
        }).finally(() => {
          this.setState({
            loading: false
          })
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
          disabled={this.state.disabled}
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
                      if (!value || value && !(value[0] && value[1])) {
                        cb('请选择活动时间')
                        // return
                      } else {
                        cb()
                      }
                    }
                  }
                ]
              }}
              name='activeTime'
            />
            <FormItem
              name='userScope'
              verifiable
              controlProps={{
                onChange: (value: string[]) => {
                  const values = this.form.getValues()
                  const allSelected = (values.userScope || []).indexOf('all') > -1
                  const newAllSelected = value.indexOf('all') > -1
                  if (!allSelected && newAllSelected || !allSelected && value.length === 6) {
                    setTimeout(() => {
                      this.form.props.form.setFieldsValue({
                        userScope: ['all', '40', '30', '20', '10', '2', '1']
                      })
                    }, 0)
                  } else if (allSelected && !newAllSelected) {
                    setTimeout(() => {
                      this.form.setValues({
                        userScope: []
                      }) 
                    }, 0)
                  } else if (allSelected && value.length <= 6) {
                    setTimeout(() => {
                      this.form.setValues({
                        userScope: value.filter((item) => item !== 'all')
                      }) 
                    }, 0)
                  }
                }
              }}
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
                    {!this.state.disabled && (
                      <span
                        className='href'
                        onClick={() => {
                          this.presentContentSelectedKey = 'activity'
                          this.select(0)
                        }}
                      >
                        请选择活动
                      </span>
                    )}
                  </FormItem>
                </div>
                <FormItem
                  labelCol={{span: 0}}
                  inner={(form) => {
                    return form.getFieldDecorator(
                      'activity',
                      {
                        rules: [
                          {
                            validator: (rules, value, cb) => {
                              if (value && value.activityList && value.activityList.length > 0) {
                                cb()
                              } else {
                                cb('请选择活动商品')
                              }
                            }
                          }
                        ]
                      }
                    )(
                      <ActivityList
                        disabled={this.state.disabled}
                      />
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
                disabled={this.state.disabled}
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
                          disabled={this.state.disabled}
                          giftCanEdit={this.state.values.strategyType === 1 && this.state.giftCanEdit}
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
                {(this.state.ladderCount < 5 && !this.state.disabled) && (
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
                disabled={this.state.disabled}
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
                        disabled={this.state.disabled}
                        giftCanEdit={this.state.values.strategyType === 0 && this.state.giftCanEdit}
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
            placeholder='此处活动说明不能超过160个字符'
            verifiable
          >
          </FormItem>
          <div
            className='text-center mt20'
          >
            {this.state.canSave && (
              <Button
                type='primary'
                onClick={this.save}
                loading={this.state.loading}
              >
                保存
              </Button>
            )}
          </div>
        </Form>
        <ActivitySelectModal
          getInstance={(ref) => {
            this.ActivityModalInstance = ref
          }}
          onOk={(rows) => {
            const values = this.form.getValues()
            const field = this.presentContentSelectedKey
            if (field === 'rank.ruleList') {
              let value = values.rank.ruleList
              value[this.currentSelectIndex] = {
                ...value[this.currentSelectIndex],
                activityList: rows
              }
              this.form.setValues({
                [field]: value
              })
            } else {
              let value = {
                ...values[field],
                activityList: rows
              }
              console.log(value, 'value')
              this.form.setValues({
                [field]: value
              })
            }
            this.ActivityModalInstance.hide()
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