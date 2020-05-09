import React, { Component } from 'react'
import { Modal, Button, Form, Input, InputNumber, Radio, Checkbox, message, DatePicker } from 'antd'
import { If } from '@/packages/common/components'
import UploadView from '../../../components/upload'
import { getBannerDetail, updateBanner, addBanner } from '../api'
import { TextMapPosition } from '../constant'
import platformType from '@/enum/platformType'
// import { formatDate } from '../../helper';
import moment from 'moment'
import BannerPostion from '@/components/banner-position'
const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
}
const _platformType = platformType.getArray({ key: 'value', val: 'label' })
const initImgList = imgUrlWap => {
  if (imgUrlWap) {
    return [
      {
        uid: 'imgUrl0',
        url: imgUrlWap,
        status: 'done',
        thumbUrl: imgUrlWap
      }
    ]
  }
  return []
}
class BannerModal extends Component {
  static defaultProps = {
    onSuccess: () => { },
    id: '',
    isEdit: false
  };
  state = {
    renderKey: 0,
    visible: false,
    data: {
      platformArray: _platformType.map(val => val.value),
      sort: 0,
      status: 1,
      seat: 1
    }
  };

  showModal = () => {
    if (this.props.isEdit) {
      this.query()
    } else {
      this.props.form.resetFields()
    }
    this.setState({
      visible: true
    })
  };

  query = () => {
    getBannerDetail({
      id: this.props.id
    }).then(data => {
      if (data.platform) {
        const str = data.platform.toString(2)
        const array = str.split('')
        data.platformArray = []
        array.forEach((val, i) => {
          if (val * 1 == 1) {
            data.platformArray.push(Math.pow(2, array.length - 1 - i).toString())
          }
        })
      } else {
        data.platformArray = _platformType.map(val => val.value)
      }
      this.setState({
        data,
        renderKey: this.state.renderKey + 1
      })
    })
  };

  handleOk = () => {
    const { onSuccess, id, form, isEdit } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const api = isEdit ? updateBanner : addBanner
        const params = {
          id,
          ...values
        }
        params.jumpUrlWap = (params.jumpUrlWap || '').trim()
        params.onlineTime = +new Date(params.onlineTime)
        params.offlineTime = +new Date(params.offlineTime)
        if (params.imgList) {
          params.imgUrlWap = params.imgList.length > 0 && params.imgList[0].rurl || ''
          params.imgList = undefined
        }
        const seat = params.seat || []
        params.newSeat = seat[0]
        params.childSeat = seat[1]
        params.seat = seat[1]
        params.platform = 0
        params.platformArray.forEach((val) => {
          params.platform += val * 1
        })
        if (params.offlineTime < params.onlineTime) {
          APP.error('下线时间必须大于上线时间')
          return
        }
        api(params).then((res) => {
          onSuccess && onSuccess()
          res && message.success('操作成功')
          this.setState({
            visible: false
          })
        })
      }
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false
    })
  };
  render () {
    const { isEdit, size } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { data, renderKey } = this.state

    let seat

    if (getFieldValue('seat') && getFieldValue('seat')[0]) {
      seat = getFieldValue('seat')
    } else {
      seat = [data.newSeat, data.childSeat]
    }

    return (
      <>
        <Button size={size} type='primary' onClick={this.showModal}>
          {isEdit ? '编辑' : '新增Banner'}
        </Button>
        <Modal
          title={isEdit ? '编辑Banner' : '新增Banner'}
          width={700}
          visible={this.state.visible}
          footer={
            <>
              <Button key='submit' type='primary' onClick={this.handleOk}>
                {isEdit ? '保存' : '新增'}
              </Button>
              <Button key='back' onClick={this.handleCancel}>
                返回
              </Button>
            </>
          }
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form {...formItemLayout}>
            <FormItem label='Banner名称'>
              {getFieldDecorator('title', {
                initialValue: data.title,
                rules: [{
                  required: true,
                  message: 'banner名称不能为空'
                }]
              })(<Input placeholder='' />)}
            </FormItem>
            <FormItem required label='位置'>
              {getFieldDecorator('seat', {
                initialValue: [data.newSeat, data.childSeat],
                rules: [
                  {
                    validator: (rule, value, cb) => {
                      console.log(value)
                      if (value[1] !== undefined) {
                        cb()
                      } else {
                        cb('位置不能为空')
                      }
                    }
                  }
                ]
              })(
                <BannerPostion
                  onChange={(val) => {
                    data.newSeat = val[0]
                    data.childSeat = val[1]
                    this.setState({
                      data
                    })
                  }}
                />
              )}
            </FormItem>
            <If condition={seat[0] === 1 && seat[1] === 0}>
              <FormItem label='banner背景颜色'>
                {getFieldDecorator('bgColor', {
                  initialValue: data.bgColor
                })(<Input placeholder='' />)}
              </FormItem>
            </If>
            <If condition={[1, 2, 3, 4].includes(seat[0])}>
              <FormItem key={renderKey} label='Banner图片' required={true}>
                {getFieldDecorator('imgList', {
                  initialValue: initImgList(data.imgUrlWap),
                  rules: [
                    {
                      required: [1, 2, 3, 4].includes(seat[0]),
                      message: '请上传Banner图片'
                    }
                  ]
                })(
                  <UploadView
                    placeholder='上传主图'
                    listType='picture-card'
                    listNum={1}
                    size={.3}
                  />,
                )}
              </FormItem>
            </If>
            <If condition={seat[0] === 5}>
              <FormItem label='文案'>
                {getFieldDecorator('content', {
                  initialValue: data.content,
                  rules: [
                    {
                      required: seat[0] === 5,
                      message: '请输入文案'
                    }
                  ]
                })(
                  <Input maxLength={25} placeholder='请输入文案' />,
                )}
              </FormItem>
            </If>
            <FormItem label='跳转地址'>
              {getFieldDecorator('jumpUrlWap', { initialValue: data.jumpUrlWap })(
                <Input placeholder='' />,
              )}
            </FormItem>
            <FormItem label='上线时间'>
              {getFieldDecorator('onlineTime', { initialValue: moment(data.onlineTime) })(
                <DatePicker showTime style={{ width: 200 }} format='YYYY-MM-DD HH:mm:ss' />,
              )}
            </FormItem>
            <FormItem label='下线时间'>
              {getFieldDecorator('offlineTime', { initialValue: moment(data.offlineTime) })(
                <DatePicker showTime style={{ width: 200 }} format='YYYY-MM-DD HH:mm:ss' />,
              )}
            </FormItem>
            <FormItem label='排序'>
              {getFieldDecorator('sort', { initialValue: data.sort })(
                <InputNumber placeholder='' />,
              )}
            </FormItem>
            <If condition={([1, 2, 3, 4].includes(seat[0])) || (seat[0] !== 5)}>
              <FormItem label='平台'>
                {getFieldDecorator('platformArray', {
                  initialValue: data.platformArray,
                  rules: [{
                    required: ([1, 2, 3, 4].includes(seat[0])) || ((seat[0] === 5) && (seat[1] === 2)),
                    message: '请选择平台'
                  }]
                })(
                  <Checkbox.Group options={_platformType}> </Checkbox.Group>
                )}
              </FormItem>
            </If>
            <FormItem label='状态'>
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
    )
  }
}

export default Form.create()(BannerModal)
