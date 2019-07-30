import React from 'react';
import { Form, Input, Select, DatePicker, Card, Button, message } from 'antd';
import { setBasePromotion } from './api';
import { isFunction } from 'lodash';
import activityType from '../../enum/activityType'
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};
class Add extends React.Component {
  state = {
    loading: false // 保存活动按钮
  }
  setBasePromotion = (params, callback) => {
    setBasePromotion(params).then((res) => {
      this.setState({
        loading: false
      })
      if (res) {
        message.success('添加活动基础信息成功');
      }
      if (isFunction(callback)) {
        callback(res);
      }
    });
  };

  handleSave = (callback, only) => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        if (only) {
          this.setState({
            loading: true
          })
        }
        const params = {
          ...vals,
          startTime: vals.time && +new Date(vals.time[0]),
          endTime: vals.time && +new Date(vals.time[1]),
        };
        delete params.time;
        this.setBasePromotion(params, id => {
          if (isFunction(callback)) {
            id && callback(id);
          }
        });
      }
    });
  };

  handleSaveNext = () => {
    const { history } = this.props;
    this.handleSave(id => {
      history.push(`/activity/info/edit/${id}`);
    });
  };

  handleReturn = () => {
    const { history } = this.props;
    history.push('/activity/list');
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card>
        <Form {...formLayout}>
          <FormItem label="活动类型">
            {getFieldDecorator('type', {
              initialValue: 1,
            })(
              <Select placeholder="请选择活动类型" style={{ width: 100 }}>
                {activityType.getArray().map((val,i)=><Option value={val.key} key={i}>{val.val}</Option>)}
              </Select>,
            )}
          </FormItem>
          <FormItem label="活动名称">
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '请输入正确的活动名称',
                },
              ],
            })(<Input placeholder="请输入活动名称" />)}
          </FormItem>
          <FormItem label="活动时间">
            {getFieldDecorator('time', {
              rules: [
                {
                  required: true,
                  message: '请选择正确的活动时间',
                },
              ],
            })(<RangePicker format="YYYY-MM-DD HH:mm:ss" showTime />)}
          </FormItem>
          <FormItem label="活动排序">
            {getFieldDecorator('sort')(<Input placeholder="请设置活动排序" />)}
          </FormItem>
          <FormItem wrapperCol={{ offset: 6 }}>
            <Button type="primary" onClick={this.handleSave.bind(this, this.handleReturn, true)} loading={this.state.loading}>
              保存活动
            </Button>
            <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleSaveNext}>
              保存活动并添加商品
            </Button>
            <Button type="danger" onClick={this.handleReturn}>
              返回
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(Add);
