import React from 'react';
import { Button, Card, InputNumber, Radio, Row, Col } from 'antd';
import { defaultConfig } from './config'; 
import { Form, FormItem } from '@/packages/common/components';
import { parseQuery } from '@/util/utils';
import { FormInstance } from '@/packages/common/components/form';
import { RouteComponentProps } from 'react-router';
import { getDetail, add, update } from './api';
import ReadOnlyComponent from '@/components/readonly-component';
import { FormComponentProps } from 'antd/es/form';
export interface SprinkleCashFormProps extends FormComponentProps, RouteComponentProps<{id: string}> {
  id ?: number,
  startTime: number,
  endTime: number,
  maxTaskNum: number,
  awardType: number,
  awardValue: number,
  rule: string,
  maxDailyTaskNum: number,
  newMemberNumMin: number,
  newMemberNumMax: number,
  maxDailyHelpNum: number,
  maxHelpNum: number,
  maxEveryDayNum: number,
  newMemberMultiple: number
}
class SprinkleCashForm extends React.Component<SprinkleCashFormProps, any> {
  id: number;
  readOnly: boolean; 
  form: FormInstance;
  constructor(props: SprinkleCashFormProps) {
    super(props);
    this.id = +props.match.params.id;
    this.readOnly = !!(parseQuery() as any).readOnly;
  }
  componentDidMount() {
    this.id !== -1 && this.fetchDetail();
  }
  get fromFields() {
    return this.form.getValues<SprinkleCashFormProps>()
  }
  // 获取详情
  fetchDetail = () => {
    getDetail(this.id).then(data => {
      this.form.setValues(data)
    })
  }
  handleSave = () => {
    this.form.props.form.validateFields((err) => {
      if (!err) {
        const vals = this.form.getValues();
        const isAdd = this.id === -1;
        // id为-1是新增
        const promiseResult =  isAdd ? add(vals) : update({ id: this.id, ...vals })
        promiseResult.then(res => {
          if (res) {
            APP.success(`${isAdd ? '新增': '编辑'}成功`);
            APP.history.go(-1);
          }
        })
      }
    })
  }
  checkMaxHelpNum = async (rule: any, value: number) => {
    if (value < this.fromFields.newMemberNumMax) {
      throw new Error('任务助力次数上限不得低于新用户助力次数上限');
    }
    return value;
  }
  checkNewMemverNumMax = async (rule: any, value: number) => {
    if (value > this.fromFields.maxHelpNum) {
      throw new Error('新用户助力次数上限不得大于任务助力次数上限');
    }
    if (value < this.fromFields.newMemberNumMin) {
      throw new Error('助力次数上限不得低于下限');
    }
    return value;
  }
  checkNewMemverNumMin = async (rule: any, value: number) => {
    if (value > this.fromFields.newMemberNumMax) {
      throw new Error('助力次数下限不得高于上限');
    }
    return value;
  }
  render () {
    return (
      <Card>
        <Form
          getInstance={ref => this.form = ref}
          readonly={this.readOnly}
          config={defaultConfig}
          namespace='sprinkleCash'
          rangeMap={{
            activityDate: {
              fields: ['startTime', 'endTime']
            }
          }}
          addonAfter={(
            <FormItem>
              {!this.readOnly && (
                <Button type='primary'
                  className='mr10'
                  onClick={this.handleSave}
                >
                  保存
                </Button>
              )}
              <Button onClick={() => APP.history.go(-1)}>返回</Button>
            </FormItem>
          )}
        >
          <Row>
            <Col offset={2}>
              <h2 style={{marginTop: 10, fontSize: 18}}>活动配置</h2>
            </Col>
          </Row>
          <FormItem
            name='activityDate'
            verifiable
          />
          <FormItem
            required
            label='任务可发起次数上限'
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('maxDailyTaskNum', {
                    rules: [{
                      required: true,
                      message: '请输入任务可发起次数上限'
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
                        precision={0}
                        min={1}
                        style={{width: 200}}
                        placeholder='任务可发起次数上限'
                        readOnly={this.readOnly}
                      />
                    </ReadOnlyComponent>
                  )}
                  <span className='ml10'>次/天</span>
                </>
              )
            }}
          />
          <FormItem
            label='任务奖励'
            required
            inner={(form) => {
              return (
                <>
                  <Radio.Group>
                    <Radio>
                      <span className='mr10'>现金</span>
                    </Radio>
                  </Radio.Group>
                  {form.getFieldDecorator('awardValue', {
                    rules: [{
                      required: true,
                      message: '请输入任务奖励'
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
                        style={{ width: 150 }}
                        placeholder='1到99999'
                        precision={2}
                        min={1}
                        max={99999}
                      />
                    </ReadOnlyComponent>
                  )}
                  <span className='ml10'>元</span>
                </>
              )
            }}
          />           
          <FormItem
            verifiable
            name='rule'
          />
          <Row>
            <Col offset={2}>
              <h2 style={{marginTop: 10, fontSize: 18}}>任务配置</h2>
            </Col>
          </Row>
          <FormItem
            label='任务助力次数上限'
            required
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('maxHelpNum', {
                    rules: [{
                      required: true,
                      message: '请输入任务助力次数上限'
                    }, {
                      validator: this.checkMaxHelpNum
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber         
                        placeholder='1到9999'
                        precision={0}
                        min={1}
                        max={9999}
                      />
                    </ReadOnlyComponent>
                  )}
                  <span className='ml10'>次</span>
                  <span className='ml20'>注：达到该次数后将不可被助力</span>
                </>
              )
            }}
          />
          <FormItem
            label='助力人数要求'
            required
          >
            <Row type='flex'>
              <span className='mr10'>新用户</span>
              <FormItem
                labelCol={{span: 0}}
                inner={(form) => {
                return form.getFieldDecorator('newMemberNumMin', {
                  rules: [{
                    required: true,
                    message: '请输入助力人数要求下限'
                  }, {
                    validator: this.checkNewMemverNumMin
                  }]
                })(
                  <ReadOnlyComponent readOnly={this.readOnly}>
                    <InputNumber
                      precision={0}
                      style={{ width: 220 }}
                      placeholder='1到9999'
                      min={1}
                      max={9999}
                    />
                  </ReadOnlyComponent>
                )
              }}>
              </FormItem>
              <span className='ml10 mr10'>至</span>
              <FormItem
                labelCol={{span: 0}}
                inner={(form) => {
                return form.getFieldDecorator('newMemberNumMax', {
                  rules: [{
                    required: true,
                    message: '请输入任务助力次数上限'
                  }, {
                    validator: this.checkNewMemverNumMax
                  }]
                })(
                  <ReadOnlyComponent readOnly={this.readOnly}>
                    <InputNumber
                      precision={0}
                      style={{ width: 220 }}
                      readOnly={this.readOnly}                    
                      placeholder='1到99999'
                      min={1}
                      max={99999}
                    />
                  </ReadOnlyComponent>
                )
              }}/>
              <span className='ml10'>人</span>
              <span style={{marginLeft: 30}}>注：每次邀新人数在区间取值，整数，两端包括</span>
            </Row>
          </FormItem>
          <FormItem
            label='每人每天助力上限'
            required
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('maxDailyHelpNum', {
                    rules: [{
                      required: true,
                      message: '请输入每人每天助力上限'
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
                        precision={0}
                        readOnly={this.readOnly}
                        placeholder='1到999'
                        min={1}
                        max={999}
                      />
                    </ReadOnlyComponent>
                  )}
                  <span className='ml10'>注：该次数含新人首次助力</span>
                </>
              )
            }}
          />
          <FormItem
            label='助力倍数'
            required
            inner={(form) => {
              return (
                <>
                  <span className='mr10'>新用户每次助力等于</span>
                  {form.getFieldDecorator('newMemberMultiple', {
                    rules: [{
                      required: true,
                      message: '请输入助力倍数'
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
                        precision={0}
                        min={5}
                        max={999}
                        placeholder='5到999'
                      />
                    </ReadOnlyComponent>
                  )}
                  <span className='ml10'>倍老用户每次助力</span>
                </>
              )
            }}
          />
        </Form>
      </Card>
    )
  }
}

export default SprinkleCashForm;