import React from 'react';
import { Form, Input, Select, DatePicker, Card, Button, message, Radio } from 'antd';
import { setBasePromotion, updateBasePromotion } from './api';
import { isFunction } from 'lodash';
import UploadView from '../../components/upload'
import activityType from '../../enum/activityType'
import moment from 'moment';
import activityTagBImg from '../../assets/images/activity-tag-bigimg.png'
import activityTagSImg from '../../assets/images/activity-tag-smimg.jpg'
import { initImgList } from '@/util/utils';
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

  constructor(props) {
    super(props);
    this.data = {
      type: 1,
      tagPosition: 0,
      tagUrl: []
    }
    if (this.props.data) {
      this.data = this.props.data;
      this.data.startTime = moment(this.data.startTime);
      this.data.endTime = moment(this.data.endTime);
      this.data.tagUrl = initImgList(this.data.tagUrl);
    }
    this.state = {
      loading: false, // 保存活动按钮
      tagUrl: this.data.tagUrl.length ? this.data.tagUrl[0].url : '',
      tagImg: activityTagSImg,
      tagClass: 'img_sm',
      place: this.data.tagPosition,
      id: this.props.data ? this.props.data.id : 0
    }
  }

  componentDidMount() {
    this.props.form.setFieldsValue(this.data);
    this.typeChange(this.data.type);
  }

  loadStatus(status) {
    this.loading = status;
    this.setState({
      loading: status
    })
  }

  setBasePromotion = (params, callback) => {
    if (this.loading) return;
    this.loadStatus(true)
    if (this.state.id) params.id = this.state.id;
    (params.id ? updateBasePromotion : setBasePromotion)(params).then((res) => {
      this.loadStatus(false)
      if (res) {
        message.success('活动基础信息保存成功');
      }
      if (isFunction(callback)) {
        callback(res);
      }
    }).catch(() => {
      this.loadStatus(false)
    })
  };

  handleSave = (callback) => {
    const {
      form: { validateFields },
      onOk
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        const params = {
          ...vals,
          startTime: +new Date(vals.startTime),
          endTime: +new Date(vals.endTime),
          tagUrl: vals.tagUrl && vals.tagUrl[0] ? replaceHttpUrl(vals.tagUrl[0].url) : ''
        };
        delete params.time;
        this.setBasePromotion(params, id => {
          if (isFunction(callback)) {
            id && callback(id);
          }
          onOk();
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

  disabledStartDate = startTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const endTime = fieldsValue.endTime;
    if (!startTime || !endTime) {
      return false;
    }
    return startTime.valueOf() > endTime.valueOf();
  };

  disabledEndDate = endTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const startTime = fieldsValue.startTime;
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
  };

  typeChange = (val) => {
    if ([1, 5, 6].includes(val)) {
      this.setState({
        tagImg: activityTagSImg,
        tagClass: 'img_sm'
      })
    } else {
      this.setState({
        tagImg: activityTagBImg,
        tagClass: 'img_bg'
      })
    }
  }
  tagUrlChange = (files) => {
    if (files.length == 0) this.setState({
      tagUrl: ''
    })
    else this.setState({
      tagUrl: files[0].url
    })
  }
  tagPositionChange = (e) => {
    this.setState({
      place: e.target.value
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card className="activity-add">
        <Form {...formLayout}>
          <FormItem label="活动类型">
            {getFieldDecorator('type', {
            })(
              <Select placeholder="请选择活动类型" style={{ width: 120 }} onChange={this.typeChange} disabled={!!this.state.id}>
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
          <FormItem label="开始时间">
            {getFieldDecorator('startTime', {
              rules: [
                {
                  required: true,
                  message: '请选择正确的活动开始时间',
                },
              ],
            })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabledDate={this.disabledStartDate} />)}
          </FormItem>
          <FormItem label="结束时间">
            {getFieldDecorator('endTime', {
              rules: [
                {
                  required: true,
                  message: '请选择正确的活动结束时间',
                },
              ],
            })(<DatePicker format="YYYY-MM-DD HH:mm:ss" showTime disabledDate={this.disabledEndDate} />)}
          </FormItem>
          <FormItem label="活动排序">
            {getFieldDecorator('sort', {
            })(<Input placeholder="请设置活动排序" />)}
          </FormItem>
          <FormItem label="活动标签">
            {getFieldDecorator('tagUrl', {
            })(<UploadView fileType='png' onChange={this.tagUrlChange} placeholder="上传活动标签" listType="picture-card" listNum={1} size={0.015} />)}
          </FormItem>
          <Form.Item label="标签位置">
            {getFieldDecorator('tagPosition', {
            })(
              <Radio.Group onChange={this.tagPositionChange}>
                <Radio value={5}>左上角</Radio>
                <Radio value={10}>左下角</Radio>
                <Radio value={15}>右上角</Radio>
                <Radio value={20}>右下角</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <FormItem wrapperCol={{ offset: 9 }}>
            <Button type="primary" onClick={this.handleSave} loading={this.state.loading}>保存</Button>
            {!this.state.id && <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleSaveNext} loading={this.state.loading}>保存并添加商品</Button>}
          </FormItem>
        </Form>
        <div className="activity-tag-preview">
          <div className={"activity-tag-preimgs " + this.state.tagClass} >
            {this.state.tagUrl && <img className={'tag tag-p' + this.state.place} src={this.state.tagUrl} />}
            <img alt="example" className='main' src={this.state.tagImg} />
          </div>
          <div className="activity-tag-pretip">
            <span style={{ fontWeight: 'bold' }}>注意事项：</span>角标实际填充内容尺寸， 宽≤170px ，高≤120px 。当角标为 吸顶类型时，角标填充内容需离侧 边的距离为≥10px, 保存格式为png格式
          </div>
        </div>
      </Card>
    );
  }
}

export default Form.create()(Add);
