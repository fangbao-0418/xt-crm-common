import React from 'react';
import { Form, Input, Select, DatePicker, Card, Button, message, Radio } from 'antd';
import { setBasePromotion } from './api';
import { isFunction } from 'lodash';
import UploadView from '../../components/upload'
import activityType from '../../enum/activityType'
import activityTagImg from '../../assets/images/activity-tag-img.png'
import './activity.scss'
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Meta } = Card;
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

const replaceHttpUrl = imgUrl => {
  return imgUrl.replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
}

class Add extends React.Component {
  state = {
    loading: false, // 保存活动按钮
    tagUrl: ''
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
          tagUrl: vals.tagUrl && replaceHttpUrl(vals.tagUrl[0].url)
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
      <Card className="activity-add">
        <Form {...formLayout}>
          <FormItem label="活动类型">
            {getFieldDecorator('type', {
              initialValue: 1,
            })(
              <Select placeholder="请选择活动类型" style={{ width: 100 }}>
                {activityType.getArray().map((val, i) => <Option value={val.key} key={i}>{val.val}</Option>)}
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
          <FormItem label="活动标签">
            {getFieldDecorator('tagUrl')(<UploadView placeholder="上传活动标签" listType="picture-card" listNum={1} size={0.2} />)}
          </FormItem>
          <Form.Item label="标签位置">
            {getFieldDecorator('tagPosition')(
              <Radio.Group>
                <Radio value="5">左上角</Radio>
                <Radio value="10">左下角</Radio>
                <Radio value="15">右上角</Radio>
                <Radio value="20">右下角</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <FormItem wrapperCol={{ offset: 9 }}>
            <Button type="primary" onClick={this.handleSave.bind(this, this.handleReturn, true)} loading={this.state.loading}>
              保存活动
            </Button>
            <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleSaveNext}>
              保存并添加商品
            </Button>
          </FormItem>
        </Form>
        <Card
          hoverable
          className="activity-tag-preview"
          style={{ width: 375 }}
          cover={<div >
            {this.state.tagUrl && <img src={this.state.tagUrl} />}
            <img alt="example" src={activityTagImg} />
          </div>}
        >
          <p>角标实际填充内容尺寸， 宽≤170px ，高≤120px 。当角标为 吸顶类型时，角标填充内容需离侧 边的距离为≥10px</p>
        </Card>
      </Card>
    );
  }
}

export default Form.create()(Add);
