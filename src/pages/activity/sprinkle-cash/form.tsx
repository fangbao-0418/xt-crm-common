import React from 'react';
import { Button, Card, InputNumber, Radio, Row, Col } from 'antd';
import { defaultConfig } from './config'; 
import { Form, FormItem } from '@/packages/common/components';
class SprinkleCashForm extends React.Component {
  render () {
    return (
      <Card>
        <Form
          config={defaultConfig}
          namespace='sprinkleCash'
          rangeMap={{
            date: {
              fields: ['beginDate', 'endDate']
            }
          }}
          addonAfter={(
            <FormItem>
              <Button type='primary'>保存</Button>
            </FormItem>
          )}
        >
          <Row>
            <Col offset={2}>
              <h2 style={{marginTop: 10, fontSize: 18}}>活动配置</h2>
            </Col>
          </Row>
          <FormItem
            name='date'
            verifiable
          />
          <FormItem
            required
            label='任务可发起次数上限'
            inner={(form) => {
              return (
                <>
                  {form.getFieldDecorator('limit', {
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
              return form.getFieldDecorator('reward', {
                rules: [{
                  required: true,
                  message: '请输入任务奖励'
                }]
              })(
                <Radio.Group>
                  <Radio>
                    <span className='mr10'>现金</span>
                    <InputNumber
                      placeholder='1到99999'
                      min={1}
                      max={99999}
                    />
                    <span className='ml10'>元</span>
                  </Radio>
                </Radio.Group>
              )
            }}
          />
          <FormItem
            verifiable
            name='rules'
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
                  {form.getFieldDecorator('helpNums')(
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
                  {form.getFieldDecorator('numsLimit')(
                    <InputNumber
                      placeholder='1到9999'
                      min={1}
                      max={9999}
                    />
                  )}
                  <span className='ml10 mr10'>至</span>
                  {form.getFieldDecorator('numsLimit')(
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
                  {form.getFieldDecorator('helpLimit')(
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
                  {form.getFieldDecorator('multiple')(
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