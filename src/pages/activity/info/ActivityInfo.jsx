import React from 'react'
import { Card, Form, Input, DatePicker, InputNumber } from 'antd'
import { activityType } from '@/enum'
import If from '@/packages/common/components/if'
import { withRouter } from 'react-router'
import Add from '../add'
import { getPromotionInfo } from '../api'
const FormItem = Form.Item
class ActivityInfo extends React.Component {
  state = {
    info: {}
  }
  componentDidMount () {
    this.getPromotionInfo()
  }
  async getPromotionInfo () {
    const info = await getPromotionInfo(this.props.match.params.id) || {}
    this.props.changeType(info)
    this.setState({ info })
  }
  disabledStartDate = (startTime) => {
    const { form } = this.props
    const fieldsValue = form.getFieldsValue()
    const endTime = fieldsValue.endTime
    if (!startTime || !endTime) {
      return false
    }
    return startTime.valueOf() > endTime.valueOf()
  };

  disabledEndDate = (endTime) => {
    const { form } = this.props
    const fieldsValue = form.getFieldsValue()
    const startTime = fieldsValue.startTime
    if (!endTime || !startTime) {
      return false
    }
    return endTime.valueOf() <= startTime.valueOf()
  };
  handleEdit = () => {
    this.setState({
      info: {
        ...this.state.info,
        visibleAct: true
      }
    })
  }
  handleOk = () => {
    this.setState({
      info: {
        ...this.state.info,
        visibleAct: false
      }
    })
    this.getPromotionInfo()
  }
  handleCancel = () => {
    this.setState({
      info: {
        ...this.state.info,
        visibleAct: false
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { type, title, isEidt, startTime, endTime, sort, activityRewardAmount } = this.state.info
    return (
      <>
        <Card
          style={{ marginBottom: 10 }}
          title='活动信息'
          extra={<span className='href' onClick={this.handleEdit}>编辑</span>}
        >
          <Form layout='inline'>
            <FormItem label='活动类型'>
              {activityType.getValue(type)}
            </FormItem>
            <FormItem label='活动名称'>
              {getFieldDecorator('title', {
                initialValue: title
              })(<Input placeholder='请输入需要编辑的活动名称' disabled={!isEidt} />)}
            </FormItem>
            <FormItem label='开始时间'>
              {getFieldDecorator('startTime', {
                initialValue: startTime
              })(
                <DatePicker
                  format='YYYY-MM-DD HH:mm:ss'
                  showTime
                  disabled={!isEidt}
                  disabledDate={this.disabledStartDate}
                />
              )}
            </FormItem>
            <FormItem label='结束时间'>
              {getFieldDecorator('endTime', {
                initialValue: endTime
              })(<DatePicker format='YYYY-MM-DD HH:mm:ss' showTime disabled={!isEidt} disabledDate={this.disabledEndDate} />)}
            </FormItem>
            <FormItem label='活动排序'>
              {getFieldDecorator('sort', {
                initialValue: sort
              })(<Input placeholder='请输入排序' disabled={!isEidt} />)}
            </FormItem>
            <If condition={type === 13}>
              <FormItem label='奖励'>
                {getFieldDecorator('activityRewardAmount', {
                  initialValue: activityRewardAmount / 100
                })(<InputNumber placeholder='请输入奖励' disabled={!isEidt} />)}
                {' '}元
              </FormItem>
            </If>
          </Form>
        </Card>
        <Add
          title='活动编辑'
          visible={this.state.info.visibleAct}
          onCancel={this.handleCancel}
          data={this.state.info}
          onOk={this.handleOk}
        />
      </>
    )
  }
}
export default withRouter(Form.create({ name: 'activityInfo' })(ActivityInfo))