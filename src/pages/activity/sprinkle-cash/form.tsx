import React from 'react';
import { Button, Card, InputNumber, Radio, Row, Col } from 'antd';
import { defaultConfig } from './config'; 
import { Form, FormItem } from '@/packages/common/components';
import { parseQuery } from '@/util/utils';
import { FormInstance } from '@/packages/common/components/form';
import { RouteComponentProps } from 'react-router';
import { getDetail, add, update } from './api';
import ReadOnlyComponent from '@/components/readonly-component';

class SprinkleCashForm extends React.Component<RouteComponentProps<{id: string}>, any> {
  id: number;
  readOnly: boolean; 
  form: FormInstance;
  constructor(props: RouteComponentProps<{id: string}>) {
    super(props);
    this.id = +props.match.params.id;
    this.readOnly = !!(parseQuery() as any).readOnly;
  }
  componentDidMount() {
    this.id !== -1 && this.fetchDetail();
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
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
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
                        placeholder='1到99999'
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
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber         
                        placeholder='1到9999'
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
            inner={(form) => {
              return (
                <>
                  <span className='mr10'>新用户</span>
                  {form.getFieldDecorator('newMemberNumMin', {
                    rules: [{
                      required: true,
                      message: '请输入新用户助力数'
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
                        placeholder='1到9999'
                        min={1}
                        max={9999}
                      />
                    </ReadOnlyComponent>
                  )}
                  <span className='ml10 mr10'>至</span>
                  {form.getFieldDecorator('newMemberNumMax', {
                    rules: [{
                      required: true,
                      message: '请输入任务助力次数上限'
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
                        readOnly={this.readOnly}                    
                        placeholder='1到99999'
                        min={1}
                        max={99999}
                      />
                    </ReadOnlyComponent>
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
                  {form.getFieldDecorator('maxDailyHelpNum', {
                    rules: [{
                      required: true,
                      message: '请输入每人每天助力上限'
                    }]
                  })(
                    <ReadOnlyComponent readOnly={this.readOnly}>
                      <InputNumber
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