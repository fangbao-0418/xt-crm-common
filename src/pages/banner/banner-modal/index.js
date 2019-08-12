import React, { Component } from 'react';
import { Modal, Button, Form, Input, InputNumber, Radio, Select, message, DatePicker } from 'antd';
import UploadView from '../../../components/upload';
import { getBannerDetail, updateBanner, addBanner } from '../api';
import { TextMapPosition } from '../constant';
// import { formatDate } from '../../helper';
import moment from 'moment';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const initImgList = imgUrlWap => {
  if (imgUrlWap) {
    return [
      {
        uid: `${-parseInt(Math.random() * 1000)}`,
        url: imgUrlWap,
        status: 'done',
        thumbUrl: imgUrlWap,
      },
    ];
  }
  return [];
};
class BannerModal extends Component {
  static defaultProps = {
    onSuccess: () => {},
    id: '',
    isEdit: false,
  };
  state = {
    renderKey: 0,
    visible: false,
    data: {
      sort: 0,
      status: 1,
      seat: 1,
    },
  };

  showModal = () => {
    this.props.isEdit && this.query();
    this.setState({
      visible: true,
    });
  };

  query = () => {
    getBannerDetail({
      id: this.props.id,
    }).then(data => {
      this.setState({
        data,
        renderKey: this.state.renderKey + 1,
      });
    });
  };

  handleOk = () => {
    const { onSuccess, id, form, isEdit } = this.props;
    form.validateFields(err => {
      if (!err) {
        const api = isEdit ? updateBanner : addBanner;
        const params = {
          id,
          ...form.getFieldsValue(),
        };
        params.onlineTime = +new Date(params.onlineTime);
        params.offlineTime = +new Date(params.offlineTime);
        if (params.imgList) {
          params.imgUrlWap = params.imgList.length > 0 && params.imgList[0].url;
          params.imgList = undefined;
        }
        api(params).then((res) => {
          onSuccess && onSuccess();
          res && message.success('操作成功');
          this.setState({
            visible: false,
          });
        });
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { isEdit } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { data, renderKey } = this.state;

    return (
      <>
        <Button type="primary" onClick={this.showModal}>
          {isEdit ? '编辑' : '新增Banner'}
        </Button>
        <Modal
          title={isEdit ? '编辑Banner' : '新增Banner'}
          width={700}
          visible={this.state.visible}
          footer={
            <>
              <Button key="submit" type="primary" onClick={this.handleOk}>
                {isEdit ? '保存' : '新增'}
              </Button>
              <Button key="back" onClick={this.handleCancel}>
                返回
              </Button>
            </>
          }
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <FormItem label="Banner名称">
              {getFieldDecorator('title', { initialValue: data.title })(<Input placeholder="" />)}
            </FormItem>
            <FormItem key={renderKey} label="Banner图片" required={true}>
              {getFieldDecorator('imgList', {
                initialValue: initImgList(data.imgUrlWap),
              })(
                <UploadView placeholder="上传主图" listType="picture-card" listNum={1} size={.5} />,
              )}
            </FormItem>
            <FormItem label="跳转地址">
              {getFieldDecorator('jumpUrlWap', { initialValue: data.jumpUrlWap })(
                <Input placeholder="" />,
              )}
            </FormItem>
            <FormItem label="位置">
              {getFieldDecorator('seat', { initialValue: data.seat })(
                <Select>
                  {Object.keys(TextMapPosition).map(value => {
                    return <Select.Option value={+value} key={value}>{TextMapPosition[value]}</Select.Option>;
                  })}
                </Select>,
              )}
            </FormItem>
            <FormItem label="上线时间">
              {getFieldDecorator('onlineTime', { initialValue: moment(data.onlineTime) })(
                <DatePicker showTime style={{ width: 200 }} format="YYYY-MM-DD HH:mm:ss" />,
              )}
            </FormItem>
            <FormItem label="下线时间">
              {getFieldDecorator('offlineTime', { initialValue: moment(data.offlineTime) })(
                <DatePicker showTime style={{ width: 200 }} format="YYYY-MM-DD HH:mm:ss" />,
              )}
            </FormItem>
            <FormItem label="排序">
              {getFieldDecorator('sort', { initialValue: data.sort })(
                <InputNumber placeholder="" />,
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: data.status })(
                <Radio.Group>
                  <Radio value={0}>关闭</Radio>
                  <Radio value={1}>开启</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(BannerModal);
