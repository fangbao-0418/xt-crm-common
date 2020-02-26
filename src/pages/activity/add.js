import React from 'react';
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select, DatePicker, Card, Button, message, Radio } from 'antd';
import { setBasePromotion, updateBasePromotion } from './api';
import { isFunction } from 'lodash';
import UploadView from '@/components/upload';
import activityType from '@/enum/activityType';
import activityTagBImg from '@/assets/images/activity-tag-bigimg.png';
import activityTagSImg from '@/assets/images/activity-tag-smimg.jpg';
import If from '@/packages/common/components/if';
import omit from 'lodash/omit';
import { replaceHttpUrl as prefixUrl} from '@/util/utils';
import './activity.scss';

const FormItem = Form.Item;
const { Option } = Select;
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

class ActivityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false, // 保存活动按钮
      tagImg: activityTagSImg,
      tagClass: 'img_sm',
      id: 0,
      canUpdate: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data) {
      const { tagUrl, type, title, sort, startTime, endTime, tagPosition, id, canUpdate } = nextProps.data;
      if (this.props.visible !== nextProps.visible) {
        console.log('nextProps.data =>', nextProps.data)
        this.props.form.setFieldsValue({
          tagUrl,
          type,
          title,
          sort,
          startTime,
          endTime,
          tagPosition
        });
        this.setState({ id, canUpdate });
        this.typeChange(type);
      }
    }
  }

  get tagUrl() {
    const tagUrl = this.props.form.getFieldValue('tagUrl') || [];
    return tagUrl.length > 0 ? tagUrl[0].url : '';
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

  // 保存
  handleSave = (callback) => {
    const {
      form: { validateFields }
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        this.setBasePromotion(vals, id => {
          if (isFunction(callback)) {
            id && callback(id);
          }
          this.handleOk();
        });
      }
    });
  };

  // 保存并添加商品
  handleSaveNext = () => {
    this.handleSave(id => {
      APP.history.push(`/activity/info/edit/${id}`);
    });
  };

  // 开始时间禁用满足条件
  disabledStartDate = startTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const endTime = fieldsValue.endTime;
    if (!startTime || !endTime) {
      return false;
    }
    return startTime.valueOf() > endTime.valueOf();
  };

  // 结束时间禁用满足条件
  disabledEndDate = endTime => {
    const { form } = this.props;
    const fieldsValue = form.getFieldsValue();
    const startTime = fieldsValue.startTime;
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
  };

  // 改变活动类型右侧图片联动
  typeChange = (val) => {
    if ([1, 5, 6, 7, 10].includes(val)) {
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

  resetFields() {
    this.props.form.resetFields();
    this.setState({
      loading: false, // 保存活动按钮
      tagImg: activityTagSImg,
      tagClass: 'img_sm',
      id: 0,
      canUpdate: true
    })
  }

  // 弹框隐藏
  handleCancel = () => {
    const { onCancel } = this.props;
    this.resetFields();
    isFunction(onCancel) && onCancel();
  }

  handleOk = () => {
    const { onOk } = this.props;
    this.resetFields();
    isFunction(onOk) && onOk();
  }

  render() {
    console.log('tagPosition =>', this.props.form.getFieldValue('tagPosition'))
    const {
      form: { getFieldDecorator },
    } = this.props;
    const otherProps = omit(this.props, ['form', 'data', 'onCancel']);
    return (
      <Modal
        width={1000}
        footer={null}
        onCancel={this.handleCancel}
        {...otherProps}
      >
        <Card className="activity-add">
          <Form {...formLayout}>
            <FormItem label="活动类型">
              {getFieldDecorator('type', {
                initialValue: 1,
                onChange: this.typeChange
              })(
                <Select
                  placeholder="请选择活动类型"
                  style={{ width: 120 }}
                  disabled={!!this.state.id}
                >
                  {activityType.getArray().map((val, i) => <Option value={val.key} key={i}>{val.val}</Option>)}
                </Select>
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
              })(
                <DatePicker
                  disabled={!!this.state.id && !this.state.canUpdate}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  disabledDate={this.disabledStartDate}
                />
              )}
            </FormItem>
            <FormItem label="结束时间">
              {getFieldDecorator('endTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择正确的活动结束时间',
                  },
                ],
              })(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  disabledDate={this.disabledEndDate}
                />
              )}
            </FormItem>
            <FormItem label="活动排序">
              {getFieldDecorator('sort', {
                rules: [
                  {
                    required: true,
                    message: '请设置活动排序',
                  },
                ],
              })(<Input placeholder="请设置活动排序" />)}
            </FormItem>
            <FormItem label="活动标签">
              {getFieldDecorator('tagUrl')(
                <UploadView
                  fileType='png'
                  placeholder="上传活动标签"
                  listType="picture-card"
                  listNum={1}
                  size={0.015}
                />
              )}
            </FormItem>
            <Form.Item label="标签位置">
              {getFieldDecorator('tagPosition', {
                initialValue: 0
              })(
                <Radio.Group>
                  <Radio value={5}>左上角</Radio>
                  <Radio value={10}>左下角</Radio>
                  <Radio value={15}>右上角</Radio>
                  <Radio value={20}>右下角</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <FormItem wrapperCol={{ offset: 9 }}>
              <Button
                type="primary"
                onClick={this.handleSave}
                loading={this.state.loading}
              >
                保存
              </Button>
              <If condition={!this.state.id}>
                <Button
                  type="primary"
                  style={{ margin: '0 10px' }}
                  onClick={this.handleSaveNext}
                  loading={this.state.loading}
                >
                  保存并添加商品
                </Button>
              </If>
            </FormItem>
          </Form>
          <div className="activity-tag-preview">
            <div className={"activity-tag-preimgs " + this.state.tagClass} >
              <If condition={this.tagUrl}>
                <img
                  className={'tag tag-p' + this.props.form.getFieldValue('tagPosition')}
                  src={prefixUrl(this.tagUrl)}
                  alt=''
                />
              </If>
              <img alt="example" className='main' src={this.state.tagImg} />
            </div>
            <div className="activity-tag-pretip">
              <span style={{ fontWeight: 'bold' }}>注意事项：</span>
              角标实际填充内容尺寸， 宽≤170px ，高≤120px 。当角标为 吸顶类型时，角标填充内容需离侧 边的距离为≥10px, 保存格式为png格式
            </div>
          </div>
        </Card>
      </Modal>
    )
  }
}

ActivityForm.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    canUpdate: PropTypes.bool,
    sort: PropTypes.number,
    type: PropTypes.number,
    tagPosition: PropTypes.number,
    visibleAct: PropTypes.bool
  }),
  visible: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default Form.create()(ActivityForm);
