import React from 'react';
import { Form, Input, Button, Row, Col, Switch } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { FormInstance } from '@/packages/common/components/form'
import * as api from './api';
import UploadView from '../../../components/upload';
import { initImgList } from '@/util/utils';
import { array } from 'prop-types';
import Live from './Live'
import { resolve } from 'dns';
interface Props extends FormComponentProps {}
interface State {
  miniCardWords: string; //标题
  miniCardImg: any[];
  posterImg: any[];
  drogueImg: any[];
}
const replaceHttpUrl = (imgUrl: string) => {
  return imgUrl.replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
};

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};
class Main extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public state: State = {
    miniCardWords: '', 
    miniCardImg: [],
    posterImg: [],
    drogueImg: []
  }

  public componentDidMount() {
    
    //获取详情信息
    api.getHomeStyle().then((res: any) => {
      console.log('getHomeStyle', res);
      if (res) {
        this.props.form.setFieldsValue({
          title: res.title,
          iconBackgroudImg: initImgList(res.iconBackgroudImg, 'img'),
          iconColor: res.iconColor,
          navigationBackgroudImg: initImgList(res.navigationBackgroudImg, 'img'),
          isOpenDrogue: res.isOpenDrogue === 0 ? false : true,
        });
        this.setState({
          miniCardWords: res.miniCardWords,
          miniCardImg: initImgList(res.miniCardImg, 'img'),
          posterImg: initImgList(res.posterImg, 'img'),
          drogueImg: initImgList(res.drogueImg, 'img'),
        })
      }
    });
  }
  public getLiveValues () {
    const liveForm: FormInstance = (this.refs.live as any).form
    return new Promise((resolve, reject) => {
      liveForm.props.form.validateFields((err, values) => {
        if (err) {
          reject()
        } else {
          resolve(values)
        }
      })
    })
  }
  //提交
  public async onSubmit() {
    const liveValues = await this.getLiveValues()
    this.props.form.validateFields((err, value) => {
      console.log(liveValues, 'liveValues')
      if (!liveValues) {
        return
      }
      if (err) {
        APP.error('保存失败');
        return;
      }
      console.log(value, 'value')
      const params = {
        title: value.title,
        iconBackgroudImg: (value.iconBackgroudImg && value.iconBackgroudImg.length && replaceHttpUrl(value.iconBackgroudImg[0].durl)) || '',
        iconColor: value.iconColor,
        navigationBackgroudImg: (value.navigationBackgroudImg && value.navigationBackgroudImg.length && replaceHttpUrl(value.navigationBackgroudImg[0].durl)) || '',
        isOpenDrogue: value.isOpenDrogue ? 1 : 0,
        drogueImg: (value.drogueImg && value.drogueImg.length && replaceHttpUrl(value.drogueImg[0].durl)) || '',
        posterImg: (value.posterImg && value.posterImg.length && replaceHttpUrl(value.posterImg[0].durl)) || '',
        miniCardImg: (value.miniCardImg && value.miniCardImg.length && replaceHttpUrl(value.miniCardImg[0].durl)) || '',
        miniCardWords: value.miniCardWords && value.miniCardWords
      };
      console.log('params', params);

      api.editHomeStyle(params).then(res => {
        console.log('保存成功', res);
        APP.success('保存成功');
      });
    });
  }

  public render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {  miniCardImg, posterImg, drogueImg, miniCardWords } = this.state;
    const isOpenDrogue =  getFieldValue('isOpenDrogue');
    return (
      <div
        style={{
          background: '#FFFFFF',
          padding: 20,
          minHeight: 400
        }}
      >
        <Form {...formLayout}>
          <Form.Item label="标题" required={true}>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: '标题不能为空'
                }
              ]
            })(<Input placeholder="请输入标题" />)}
          </Form.Item>
          <Form.Item label="导航栏背景图" required={true}>
            {getFieldDecorator('navigationBackgroudImg', {
              rules: [
                {
                  required: true,
                  message: '请上传导航栏背景图'
                }
              ]
            })(
              <UploadView
                accept=".jpg, .gif, .png"
                placeholder="上传背景图"
                listType="picture-card"
                listNum={1}
                size={0.3}
              />
            )}
          </Form.Item>
          <Form.Item label="注意事项">
            <div style={{ lineHeight: 1.5 }}>
              1、该背景图主要用在首页顶部导航栏，必填项。
              <br />
              2、图片格式支持png、jpg、gif格式。（推荐使用png格式）
              <br />
              3、图片尺寸为828*320像素，大小不超过300kb。
            </div>
          </Form.Item>
          <Form.Item label="icon背景图">
            {getFieldDecorator('iconBackgroudImg', {
              rules: [
                {
                  required: false,
                  message: '图片格式不正确'
                }
              ]
            })(
              <UploadView
                accept=".jpg, .gif, .png"
                placeholder="上传icon图"
                listType="picture-card"
                listNum={1}
                size={0.3}
              />
            )}
          </Form.Item>
          <Form.Item label="注意事项">
            <div style={{ lineHeight: 1.5 }}>
              1、该背景图主要用在首页icon区域，非必填项，默认白色背景图。
              <br />
              2、图片格式支持png、jpg、gif格式。（推荐使用png格式）
              <br />
              3、一行图标背景图片尺寸为750*176像素；
              <br />
              二行图标背景图片尺寸为750*320像素；大小不超过300kb。
            </div>
          </Form.Item>
          <Form.Item label="icon名称色值：">
            {getFieldDecorator('iconColor', {
              rules: [
                {
                  required: true,
                  message: 'icon名称值不能为空'
                },
                {
                  pattern: /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/g,
                  message: 'icon名称值不正确'
                }
              ]
            })(<Input maxLength={7} placeholder="请输入首页icon名称的色值，如#333333" />)}
          </Form.Item>
          <Form.Item label="注意事项">
            <div style={{ lineHeight: 1.5 }}>
              1.该色值主要用在首页icon名称，必填项，默认黑色#333333。
              <br />
              2.色值范围是#000000~#FFFFFF。
              <br />
            </div>
          </Form.Item>
          <Form.Item label="是否展示分享浮标">
            {getFieldDecorator('isOpenDrogue', {
            })(<Switch checked={isOpenDrogue}/>)}
          </Form.Item>
          {
            isOpenDrogue && <>
              <Form.Item label="分享图标">
                {getFieldDecorator('drogueImg', {
                  initialValue: drogueImg,
                  rules: [
                    {
                      required: true,
                      message: '请上传分享图标'
                    }
                  ]
                })(
                  <UploadView
                    accept=".jpg, .gif, .png"
                    placeholder="上传图标"
                    listType="picture-card"
                    listNum={1}
                    pxSize={[{width:180, height:180}]} 
                  />
                )}
                <p>
                  • 主要用于首页的分享图标样式
                </p>
                <p>
                  • 支持gif图，规格为：180*180像素
                </p>
              </Form.Item>
              <Form.Item label="分享海报">
                {getFieldDecorator('posterImg', {
                  initialValue: posterImg,
                  rules: [
                    {
                      required: true,
                      message: '请上分享海报'
                    }
                  ]
                })(
                  <UploadView
                    accept=".jpg, .png"
                    placeholder="上传图片"
                    listType="picture-card"
                    listNum={1}
                    pxSize={[{width:750, height:1000}]} 
                  />
                )}
                <p>
                  • 主要用于首页分享按钮对应的海报图
                </p>
                <p>
                  • 图片格式支持png,jpg，规格为：750*1000像素
                </p>
              </Form.Item>
              <Form.Item label="分享小程序卡片">
                {getFieldDecorator('miniCardImg', {
                  initialValue: miniCardImg,
                  rules: [
                    {
                      required: true,
                      message: '请上传分享小程序卡片'
                    }
                  ]
                })(
                  <UploadView
                    accept=".jpg, .png"
                    placeholder="上传图片"
                    listType="picture-card"
                    listNum={1}
                    pxSize={[{width:250, height:200}]} 
                  />
                )}
                <p>
                  • 主要用于首页分享按钮对应的小程序卡片样式
                </p>
                <p>
                  • 图片格式支持png,jpg，规格为：250*200像素
                </p>
              </Form.Item>
              <Form.Item label="小程序卡片文案">
                {getFieldDecorator('miniCardWords', {
                  rules: [
                    {
                      required: true,
                      message: '小程序卡片文案'
                    },
                    {
                      max: 28,
                      message: '输入字符不能大于28个'
                    }
                  ],
                  initialValue: miniCardWords
                })(<Input placeholder="小程序卡片文案" max={28}/>)}
                <span>最多28个字符</span>
              </Form.Item>
            </>
          }
        </Form>
        <Live ref='live' />
        <div>
          <Button
            style={{margin: '0px 0px 50px 300px'}}
            type="primary"
            onClick={this.onSubmit}
          >
            保 存
          </Button>
        </div>
      </div>
    );
  }
}
export default Form.create()(Main);
