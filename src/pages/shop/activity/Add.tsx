import React from 'react'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Form, FormItem, Alert } from '@/packages/common/components'
import { Card, Radio, InputNumber, Table, Button } from 'antd'
import { addPromotion, getPromotionDetail } from './api'
import { getDefaultConfig } from './config'
import { ColumnProps } from 'antd/lib/table'
import StoreModal from './StoreModal'
import { FormInstance } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils'
interface Props extends AlertComponentProps {}
class Main extends React.Component<Props> {
  public formRef: FormInstance
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
        <span
          className='href'
          onClick={() => {
            const { dataSource } = this.formRef.getValues()
            dataSource.splice(index, 1)
            this.formRef.setValues({ dataSource })
          }}
        >删除</span>
      )
    }
  }]
  public componentDidMount() {
    this.fetchData()
  }
  // 查看详情
  public fetchData = async () => {
    const query: any = parseQuery()
    if (query.promotionId) {
      const res = await getPromotionDetail(query.promotionId)
      this.formRef.setValues(res)
    }
  }
  /** 添加店铺 */
  public handleAdd = () => {
    let dataSource: any[] = []
    this.props.alert({
      title: '选择店铺',
      width: 1200,
      content: (
        <StoreModal
          onChange={(rows) => {
            dataSource = rows
          }}
        />
      ),
      onOk: () => {
        this.formRef.setValues({ dataSource })
      }
    })
  }
  /** 保存活动 */
  public handleSave = () => {
    this.formRef.props.form.validateFields(async (err) => {
      if (!err) {
        const vals = this.formRef.getValues()
        const res = await addPromotion(vals)
        if (res) {
          APP.success('新建活动成功')
          APP.history.goBack()
        }
      }
    })
  }
  public render () {
    return (
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
            name='applyTime'
            verifiable
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
            name='activityTime'
            verifiable
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
                        min={0}
                        max={100}
                        className='ml10 mr10'
                        precision={0}
                      />)}
                    <span>%</span>
                  </div>
                  <div>（输入正整数，比例后取两位小数，例如日常供货价79，比高于日常供货价85%，即活动供货价最高为67.15元）</div>
                </>
              )
            }}
          />
          <FormItem
            label='报名商家类型'
            required
            inner={(form) => {
              return (
                <>
                  <div>指定店铺参与<span className='href' onClick={this.handleAdd}>+添加店铺</span>（指定几个商家，会单独拆分为几个会场）</div>
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
                      <Table columns={this.columns} />
                    )
                  }
                </>
              )
            }}
          />
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
    )
  }
}

export default Alert(Main)