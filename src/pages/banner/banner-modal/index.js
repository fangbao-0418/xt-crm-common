import React, { Component } from 'react'
import { Tag, Select, Modal, Button, Checkbox, message } from 'antd'
import If from '@/packages/common/components/if'
import UploadView from '@/components/upload'
import { getBannerDetail, updateBanner, addBanner } from '../api'
import platformType from '@/enum/platformType'
import moment from 'moment'
import BannerPostion from '@/components/banner-position'
import StartPageUpload from './components/StartPageUpload'
import { Form, FormItem } from '@/packages/common/components'
import { getDefaultConfig } from './config'
import styles from './style.module.styl'

const Option = Select.Option
/**
 * key
 * 1.首页
 * 2.分类频道
 * 3.严选
 * 4.支付结果
 * 5.直播
 * 6.充值中心
 * 7.搜索列表
 * 8.商品详情页
 */
const _platformType = platformType.getArray({ key: 'value', val: 'label' })

const initImgList = (imgUrlWap, num) => {
  if (!imgUrlWap) {
    return
  }
  imgUrlWap = (imgUrlWap || '').split(',')
  const arr = []
    imgUrlWap.map((item,index)=>{
      if (num===2) {
        arr.push({
          uid: 'img' + index,
          url: item
        })
      } else{
        index===0&& 
        arr.push({
          uid: 'img' + index,
          url: item
        })
      }
    })
  return arr
}
class BannerModal extends Component {
  static defaultProps = {
    onSuccess: () => { },
    id: '',
    isEdit: false
  }
  state = {
    renderKey: 0,
    bizSource: '0',
    visible: false,
    data: {
      platformArray: [],
      sort: 0,
      status: 1,
      seat: 1,
      bizSource: '0'
    }
  }

  showModal = () => {
    if (this.props.isEdit) {
      this.query()
    }
    this.setState({
      visible: true
    })
  };

  query = () => {
    getBannerDetail({
      id: this.props.id
    }).then(data => {
      // 平台
      if (data.platform) {
        const str = data.platform.toString(2)
        const array = str.split('')
        APP.moon.logger({
          platform: str
        }, 'Banner-App启动页-获取')
        data.platformArray = []
        array.forEach((val, i) => {
          if (val * 1 == 1) {
            data.platformArray.push(Math.pow(2, array.length - 1 - i).toString())
          }
        })
      } else {
        data.platformArray = _platformType.map(val => val.value)
      }
      // 可见用户
      if (data.memberRestrict) {
        const str = data.memberRestrict.toString(2)
        const array = str.split('')
        data.memberRestrictArray = []
        array.forEach((val, i) => {
          if (val * 1 == 1) {
            data.memberRestrictArray.push(Math.pow(2, array.length - 1 - i).toString())
          }
        })
      } else {
        data.platformArray = [_platformType[2],_platformType[3]].map(val => val.value)
      }
      this.setState({
        data,
        bizSource: data.bizSource,
        renderKey: this.state.renderKey + 1
      })
      this.formRef.props.form.setFieldsValue({
        title: data.title,
        bizSource: data.bizSource,
        seat: [data.newSeat, data.childSeat],
        onlineTime: moment(data.onlineTime),
        offlineTime: moment(data.offlineTime),
        sort: data.sort,
        status: data.status
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
        const seat = params.seat || []
        if (params.imgList) {
          params.imgUrlWap = params.imgList.length > 0 && params.imgList[0].rurl || ''
          params.imgList = undefined
        }
        if([10].includes(seat[0])){
          APP.moon.logger({
            platformArray: params.platformArray
          }, 'Banner-App启动页-提交')
          if(!params.imgList1||(params.imgList1&&(params.imgList1.length !==2||!params.imgList1[0].rurl||!params.imgList1[1].rurl))){
            APP.error('请上传两张banner图片')
            return
          }
          params.imgUrlWap=(params.imgList1[0].rurl+','+params.imgList1[1].rurl)
        }
        params.newSeat = seat[0]
        params.childSeat = seat[1]
        params.seat = seat[1]
        // 平台
        if (params.platformArray) {
          params.platform = 0
          params.platformArray.forEach((val) => {
            params.platform += val * 1
          })
        }
        // 可见用户
        if (params.memberRestrictArray) {
          params.memberRestrict = 0
          params.memberRestrictArray.forEach((val) => {
            params.memberRestrict += val * 1
          })
        }
        if([10].includes(seat[0])&&params.platform>6){
          APP.moon.logger({
            platform: params.platform
          }, 'Banner-App启动页-修改值')
          params.platform=6
        }

        if (params.keywordsList&&params.keywordsList.length>20) {
          APP.error('关键字不能超过20个')
          return
        }
        if (params.offlineTime < params.onlineTime) {
          APP.error('下线时间必须大于上线时间')
          return
        }
        api(params).then((res) => {
          onSuccess && onSuccess()
          res && message.success('操作成功')
          this.setState({
            visible: false,
            data: {}
          })
        })
      }
    })
  };

  handleCancel = e => {
    this.formRef.resetValues()
    this.setState({
      visible: false
    })
  };
  render () {
    const { isEdit, size } = this.props
    const { data, renderKey } = this.state
    const seat = [data.newSeat, data.childSeat]
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
          <Form
            config={getDefaultConfig()}
            getInstance={(ref) => {
              this.formRef = ref
            }}
          >
            <FormItem verifiable name='title' />
            {/* <FormItem name='bizSource'
              required
              inner={(form) => {
                return form.getFieldDecorator('bizSource', {
                  rules: [{
                    required: true,
                    message: 'banner渠道不能为空'
                  }],
                  onChange: (bizSource) => {
                    this.setState({ bizSource }, () => {
                      this.formRef.setValues({ seat: [] })
                    })
                  }
                })(
                  <Select placeholder='请选择banner渠道' allowClear>
                    <Select.Option value={0}>喜团优选</Select.Option>
                    <Select.Option value={20}>喜团好店</Select.Option>
                  </Select>
                )
              }}
            /> */}
            <FormItem
              name='bizSource'
              verifiable
              controlProps={{
                onChange: (bizSource) => {
                  console.log('bizSource', bizSource)
                  this.setState({ bizSource }, () => {
                    this.formRef.setValues({ seat: [] })
                  })
                }                
              }}
            />
            <FormItem
              required
              label='位置'
              inner={(form) => {
                return form.getFieldDecorator('seat', {
                  rules: [
                    {
                      validator: (rule, value, cb) => {
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
                    bizSource={this.state.bizSource}
                    onChange={(val) => {
                      if([val[0], seat[0]].includes(10)){
                        setFieldsValue({
                          imgList:undefined,
                          imgList1:undefined,
                          platformArray:undefined
                        })
                      }
                      data.newSeat = val[0]
                      data.childSeat = val[1]
                      this.setState({
                        data
                      })
                      
                    }}
                  />
                )
              }}
            />
            <If condition={seat[0] === 1 && seat[1] === 0}>
              <FormItem name='bgColor' />
            </If>
              <If condition={[10].includes(seat[0])} >
                <FormItem
                  key={renderKey}
                  label='Banner图片'
                  required={true}
                  inner={(form) => {
                    return form.getFieldDecorator('imgList1', {
                      initialValue: initImgList(data.imgUrlWap, 2),
                      rules: [
                       {
                          validator: (rule, value, cb) => {
                            if([10].includes(seat[0])){
                              if (!value?.length) {
                                cb('请上传两张Banner图片')
                              } else if (!value?.[0]) {
                                cb('请上传Banner图1')
                              } else if (!value?.[1]) {
                                cb('请上传Banner图2')
                              }
                            }
                            cb()
                          }
                        }
                      ]
                    })(<StartPageUpload />)
                  }}
                />
              </If>
              <If condition={[1, 2, 3, 4, 6, 7, 8, 9].includes(seat[0])}>
                <FormItem
                  key={renderKey}
                  label='Banner图片'
                  required={true}
                  inner={(form) => {
                    return form.getFieldDecorator('imgList', {
                      initialValue: initImgList(data.imgUrlWap,1),
                      rules: [
                        {
                          required: true,
                          message: '请上传Banner图片'
                        }
                      ]
                    })(
                      <UploadView
                        placeholder='上传主图'
                        listType='picture-card'
                        fileType={['jpg', 'jpeg', 'gif', 'png']}
                        listNum={1}
                        size={0.3}
                      />
                    )
                  }}
                />
              </If>
            <If condition={seat[0] === 5}>
              <FormItem name='content' />
            </If>
            <FormItem name='jumpUrlWap' />
            <FormItem name='onlineTime' />
            <FormItem name='offlineTime' />
            <FormItem name='sort' />
            {this.state.bizSource === '0' && (
              <If condition={([1, 2, 3, 4, 6, 7, 8, 9, 10].includes(seat[0])) || ((seat[0] === 5) && (seat[1] === 2))}>
                <FormItem
                  label='平台'
                  inner={(form) => {
                    return form.getFieldDecorator('platformArray', {
                      initialValue: data.platformArray,
                      rules: [{
                        required: true,
                        message: '请选择平台'
                      }]
                    })(
                      <Checkbox.Group
                        options={[10].includes(seat[0])?[_platformType[0],_platformType[1]]:_platformType}
                      />
                    )
                }}/>
              </If>
            )}
            {this.state.bizSource === '20' && (<>
              <FormItem
                label='平台'
                inner={(form) => {
                  return form.getFieldDecorator('platformArray', {
                    rules: [{
                      required: true,
                      message: '请选择平台'
                    }]
                  })(
                    <Checkbox.Group
                      options={[_platformType[2],_platformType[3]]}
                    />
                  )
                }}
              />
              <FormItem name='memberRestrictArray' />
            </>)}
            <If condition={seat[0] === 7}>
              <FormItem
                label='关键词'
                inner={(form) => {
                  return form.getFieldDecorator('keywordsList', {
                    initialValue: data.keywordsList,
                    rules: [
                      {
                        validator: (rule, value, cb) => {
                          console.log(value,'111')
                          if(seat[0] === 7){
                            if(!value||(value&&value.length===0)){
                              cb('请输入关键词')
                            }
                            if(value.length>20){
                              cb('不能超过20个关键词')
                            }
                            value.map((item)=>{
                              if(item.length>10){
                                cb('单个关键词不能超过10个字符')
                              }
                            })
                          }
                          cb()
                        }
                      }
                    ]
                  })(
                    <Select
                      mode={'tags'}
                      ref={(ref)=>{
                        this.ref=ref
                      }}
                      placeholder='请输入关键词'
                      id='keywordsList'
                      tokenSeparators={[',']}
                      maxLength={10}
                      name='keywordsList'
                      dropdownClassName={styles['select-auto']}
                    />
                  )
                }}/>
            </If>
            <FormItem name='status' />
          </Form>
        </Modal>
      </>
    )
  }
}

export default BannerModal
