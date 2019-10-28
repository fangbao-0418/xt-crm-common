import React from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import * as api from './api'
import UploadView from '../../../components/upload';
import { initImgList } from '@/util/utils';
interface Props extends FormComponentProps {}
interface State {
  title: string,//标题
  iconBackgroudImg: string, //icon背景图
  iconColor: string, //icon文字颜色
  navigationBackgroudImg: string //导航栏背景图
}
const replaceHttpUrl = (imgUrl: string ) => {
  return imgUrl.replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
}

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
class Main extends React.Component<Props, State> {
  public constructor (props: Props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  public state: State = {
    title: '', 
    iconBackgroudImg: '',
    iconColor: '#333333',
    navigationBackgroudImg: ''
  }
  public componentDidMount () {
    //获取详情信息
    api.getHomeStyle().then((res: any) => {
      console.log('getHomeStyle', res)
      if (res) {
        this.setState({
          title: res.title,
          iconBackgroudImg: res.iconBackgroudImg,
          iconColor: res.iconColor,
          navigationBackgroudImg: res.navigationBackgroudImg
        }) 
      }
    })
  }
  //提交
  public onSubmit () {
    this.props.form.validateFields((err, value) => {
      if (err) {
        APP.error('保存失败')
        return
      }
      
      const params = {
        title: value.title,
        iconBackgroudImg: value.iconBackgroudImg.length && replaceHttpUrl(value.iconBackgroudImg[0].durl) || "",
        iconColor: value.iconColor,
        navigationBackgroudImg: value.navigationBackgroudImg.length && replaceHttpUrl(value.navigationBackgroudImg[0].durl) || "",
      }
      console.log('params', params)
      
      api.editHomeStyle( params ).then((res) => {
        console.log('保存成功', res)
        APP.success('保存成功')
      })
    })
  }
  
  public render () {
    const { getFieldDecorator } = this.props.form
    const { title, iconBackgroudImg, iconColor, navigationBackgroudImg } = this.state
    
    return (
      <div
        style={{
          background: '#FFFFFF',
          padding: 20,
          minHeight: 400
        }}
      >
        <Form
          {...formLayout}
          onSubmit={this.onSubmit}
        >
          <Form.Item label='标题' required={true}>
            {
              getFieldDecorator('title', {
                initialValue: title,
                rules: [{
                  required: true,
                  message: '标题不能为空'
                }]
              })(
                <Input placeholder="请输入标题" />
              )
            }
          </Form.Item>
          <Form.Item label="导航栏背景图" required={true}>
            {getFieldDecorator('navigationBackgroudImg', {
              initialValue: initImgList(navigationBackgroudImg, 'img'),
              rules: [
                {
                  required: true,
                  message: '请上传导航栏背景图'
                },
              ],
            })(<UploadView accept=".jpg, .gif, .png" placeholder="上传背景图"  listType="picture-card" pxSize={{width: 828, height: 266}} listNum={1} size={.3} />)}
          </Form.Item>
          <Form.Item label="注意事项">
            <div style={{lineHeight: 1.5}}>
              1、该背景图主要用在首页顶部导航栏，必填项。<br/>
              2、图片格式支持png、jpg、gif格式。<br/>
              3、图片尺寸为828*266像素，大小不超过300kb。
            </div>
          </Form.Item>
          <Form.Item label="icon背景图" >
            {getFieldDecorator('iconBackgroudImg', {
              initialValue: initImgList(iconBackgroudImg, 'img'),
              rules: [
                {
                  required: false,
                  message: '图片格式不正确'
                },
              ],
            })(<UploadView accept=".jpg, .gif, .png" placeholder="上传icon图" listType="picture-card" pxSize={{width: 750, height: 320}} listNum={1} size={.3} />)}
          </Form.Item>
          <Form.Item label="注意事项">
            <div style={{lineHeight: 1.5}}>
              1、该背景图主要用在首页icon区域，非必填项，默认白色背景图。<br/>
              2、图片格式支持png、jpg、gif格式。<br/>
              3、一行图标背景图片尺寸为750*176像素；<br/>
              二行图标背景图片尺寸为750*320像素；大小不超过300kb。
            </div>
          </Form.Item>
          <Form.Item label='icon名称色值：'>
            {
              getFieldDecorator('iconColor', {
                initialValue: iconColor,
                rules: [{
                  required: true,
                  message: 'icon名称值不能为空'
                },{
                  pattern: /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g,
                  message: 'icon名称值不正确'
                }]
              })(
                <Input maxLength={7} placeholder="请输入首页icon名称的色值，如#333333" />
              )
            }
          </Form.Item>
          <Form.Item label="注意事项">
            <div style={{lineHeight: 1.5}}>
              1.该色值主要用在首页icon名称，必填项，默认黑色#333333。<br/>
              2.色值范围是#000000~#FFFFFF。<br/>
            </div>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">保 存</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default Form.create()(Main)