import React from 'react';
import { Button, Card, InputNumber, Radio, Row, Col } from 'antd';
import { defaultConfig } from './config'; 
import { Form, FormItem } from '@/packages/common/components';
import { FormInstance } from '@/packages/common/components/form';
import { RouteComponentProps } from 'react-router';
import { getDetail, add, update } from './api';
class SprinkleCashForm extends React.Component<RouteComponentProps<{id: string}>, any> {
  id: number;
  form: FormInstance;
  constructor(props: RouteComponentProps<{id: string}>) {
    super(props);
    this.id = +props.match.params.id;
  }
  componentDidMount() {
    this.fetchDetail();
  }
  // 获取详情
  fetchDetail = () => {
    getDetail(this.id).then(data => {
      this.form.setValues(data)
    })
  }
  handleSave = () => {
    this.form.props.form.validateFields((err, vals) => {
      if (!err) {
        // 新增
        if (this.id === -1) {

        }
        // 编辑
        else {
          
        }
      }
    })
  }
  render () {
    return (
      <Card>
        <Form
          getInstance={ref => this.form = ref}
          config={defaultConfig}
          namespace='sprinkleCash'
          rangeMap={{
            activityDate: {
              fields: ['startTime', 'endTime']
            }
          }}
          addonAfter={(
            <FormItem>
              <Button type='primary' onClick={this.handleSave}>保存</Button>
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
                  {form.getFieldDecorator('maxHelpNum', {
                    rules: [{
                      required: true,
                      message: '请输入任务可发起次数上限'
                    }]
                  })(
                    <InputNumber
                      style={{width: 200}}
                      placeholder='任务可发起次数上限'
                    />
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
                    <InputNumber
                      placeholder='1到99999'
                      min={1}
                      max={99999}
                    />
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
                    }]
                  })(
                    <InputNumber
                      placeholder='1到9999'
                      min={1}
                      max={9999}
                    />
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
            inner={(form) => {
              return (
                <>
                  <span className='mr10'>新用户</span>
                  {form.getFieldDecorator('newMemberNum', {
                    rules: [{
                      required: true,
                      message: '请输入新用户助力数'
                    }]
                  })(
                    <InputNumber
                      placeholder='1到9999'
                      min={1}
                      max={9999}
                    />
                  )}
                  <span className='ml10 mr10'>至</span>
                  {form.getFieldDecorator('maxHelpNum', {
                    rules: [{
                      required: true,
                      message: '请输入任务助力次数上限'
                    }]
                  })(
                    <InputNumber
                      placeholder='1到99999'
                      min={1}
                      max={99999}
                    />
                  )}
                  <span className='ml10'>人</span>
                  <span style={{marginLeft: 30}}>注：每次邀新人数在区间取值，整数，两端包括</span>
                </>
              )
            }}
          />
          <FormItem
            label='每人每天助力上限'
            required
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('maxEveryDayNum', {
                    rules: [{
                      required: true,
                      message: '请输入每人每天助力上限'
                    }]
                  })(
                    <InputNumber
                      placeholder='1到999'
                      min={1}
                      max={999}
                    />
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
                    <InputNumber
                      min={5}
                      max={999}
                      placeholder='5到999'
                    />
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