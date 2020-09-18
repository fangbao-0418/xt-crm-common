import React from 'react'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Form, FormItem, Alert } from '@/packages/common/components'
import { DatePicker, Card, Radio, InputNumber, Table, Button, Popconfirm, Modal } from 'antd'
import { addPromotion, getPromotionDetail, updatePromotion } from './api'
import { getDefaultConfig } from './config'
import { ColumnProps } from 'antd/lib/table'
import StoreModal from './StoreModal'
import { FormInstance } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils'
import moment from 'moment'
import { disabledDate, disabledDateTime } from '@/util/antdUtil'

const { RangePicker } = DatePicker
interface Props extends AlertComponentProps {}
interface State {
  selectedRowKeys: any[]
}
class Main extends React.Component<Props, State> {
  public state = {
    selectedRowKeys: []
  }
  public formRef: FormInstance
  public storeModal: any
  public promotionId = (parseQuery() as any).promotionId
  public copy = (parseQuery() as any).copy
  public columns: ColumnProps<any>[] = [{
    title: '店铺id',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '操作',
    render: (text: any, record: any, index: number) => {
      return (
        <Popconfirm
          title="是否确认删除该店铺?"
          onConfirm={() => {
            const { dataSource } = this.formRef.getValues()
            dataSource.splice(index, 1)
            this.formRef.setValues({ dataSource })
          }}
          okText="确认"
          cancelText="取消"
        >
        <span
          className='href'
        >删除</span>
        </Popconfirm>
      )
    }
  }]
  public componentDidMount() {
    this.fetchData()
  }
  // 查看详情
  public fetchData = async () => {
    if (this.promotionId) {
      const res = await getPromotionDetail(this.promotionId)
      this.formRef.setValues(res)
      this.setState({ selectedRowKeys: (res.dataSource || []).map((v: any) => v.shopId) })
    }
  }
  /** 添加店铺 */
  public handleAdd = () => {
    this.storeModal.open()
  }
  /** 保存活动 */
  public handleSave = () => {
    this.formRef.props.form.validateFields(async (err) => {
      if (!err) {
        const vals = this.formRef.getValues()
        if (vals.applyStartTime < Date.now()) {
          return void APP.error('活动报名开始时间不能小于当前时间')
        }
        if (vals.startTime <= vals.applyEndTime) {
          return void APP.error('报名时间不能大于活动时间')
        }
        let res
        if (this.promotionId && !this.copy) {
          res = await updatePromotion({ ...vals, promotionId: this.promotionId})
          if (res) {
            APP.success('编辑活动成功')
            APP.history.goBack()
          }
        } else {
          res = await addPromotion(vals)
          if (res) {
            APP.success('新建活动成功')
            APP.history.goBack()
          }
        }

      }
    })
  }
  // public disabledTime = (dates: [moment.Moment, moment.Moment], type: 'start'|'end') => {
  //   if (type === 'start' && dates) {
  //     let result = disabledDateTime(dates[0], new Date());
  //     return result
  //   }
  //   return {
  //   }
  // }
  public render () {
    return (
      <>
        <StoreModal
          ref={(ref) => this.storeModal = ref}
          selectedRowKeys={this.state.selectedRowKeys}
          onOk={(dataSource: any[]) => {
            this.formRef.setValues({ dataSource })
          }}
        />
        <Form
          getInstance={(ref) => {
            this.formRef = ref
          }}
          rangeMap={{
            applyTime: {
              fields: ['applyStartTime', 'applyEndTime']
            },
            activityTime: {
              fields: ['startTime', 'endTime']
            }
          }}
          config={getDefaultConfig()}
        >
          <Card title='活动报名设置'>
            <FormItem
              name='title'
              verifiable
              controlProps={{
                style: {
                  width: 220
                }
              }}
            />
            <FormItem
              name='type'
              verifiable
              controlProps={{
                style: {
                  width: 220
                }
              }}
            />
            <FormItem
              name='description'
              verifiable
            />
            <FormItem
              required
              label='活动报名时间'
              inner={(form) => {
                return form.getFieldDecorator('applyTime', {
                  rules: [{
                    required: true,
                    message: '活动报名时间不能为空'
                  }]
                })(
                  <RangePicker
                    disabledDate={(current: moment.Moment | null) => disabledDate(current, moment())}
                    // disabledTime={this.disabledTime as any}
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )
              }}
            />
            <FormItem
              label='是否预热'
              required
              inner={(form) => {
                return form.getFieldDecorator('preheat', {
                  initialValue: 1,
                  rules: [{
                    required: true,
                    message: '请选择是否预热'
                  }]
                })(
                  <Radio.Group>
                    <Radio value={1} style={{ display: 'block' }}>是，活动开始前24小时，会场同步到线上预热</Radio>
                    <Radio value={0} style={{ display: 'block' }}>否，活动正式开始时线上开放</Radio>
                  </Radio.Group>
                )
              }}
            />
            <FormItem
              label='活动排期时间'
              required
              inner={(form) => {
                const applyTime = form.getFieldValue('applyTime')
                return form.getFieldDecorator('activityTime', {
                  rules: [{
                    required: true,
                    message: '活动排期时间不能为空'
                  }]
                })(
                  <RangePicker
                    disabledDate={(current: moment.Moment | null) => {
                      if (applyTime?.[1]) {
                        return disabledDate(current, applyTime[1])
                      }
                      return disabledDate(current, moment())
                    }}
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                )
              }}
            />
          </Card>
          <Card title='活动规则和要求'>
            <FormItem
              label='活动供货价'
              required
              inner={(form) => {
                return (
                  <>
                    <div>
                      <span>不高于日常供货价的</span>
                      {form.getFieldDecorator('costPriceDiscount', {
                        rules: [{
                          required: true,
                          message: '请输入供货价折扣'
                        }]
                      })(
                        <InputNumber
                          min={1}
                          max={100}
                          className='ml10 mr10'
                          precision={0}
                        />)}
                      <span>%</span>
                    </div>
                    <div>（输入正整数，比例后取两位小数，例如日常供货价79，不高于日常供货价85%，即活动供货价最高为67.15元）</div>
                  </>
                )
              }}
            />
            {(!this.promotionId || this.copy === '1') && (
              <FormItem
                label='报名店铺类型'
                required
                inner={(form) => {
                  return (
                    <>
                      <div>指定店铺参与<span className='href' onClick={this.handleAdd}>+添加店铺</span>（指定几个店铺，会单独拆分为几个会场）</div>
                      {
                        form.getFieldDecorator('dataSource', {
                          valuePropName: 'dataSource',
                          rules: [{
                            validator: (rule: any, value: any, callback: any) => {
                              if (Array.isArray(value) && value.length > 0) {
                                callback()
                              } else {
                                callback('请添加店铺')
                              }
                            }
                          }]
                        })(
                          <Table columns={this.columns} rowKey='shopId' />
                        )
                      }
                    </>
                  )
                }}
              />
            )}
          </Card>
          <div>
            <Button
              type='primary'
              onClick={this.handleSave}
            >
              保存
            </Button>
            <Button
              className='ml10'
              onClick={() => {
                APP.history.goBack()
              }}
            >
              取消
            </Button>
          </div>
        </Form>
      </>
    )
  }
}

export default Alert(Main)