import React from 'react'
import { Form, Input, Button, Icon, Card, Switch, Radio, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Upload from '@/components/upload'
import Content from './components/content'
import * as api from './api'
import styles from './style.module.sass'
import { namespace } from './model'
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  detail: Special.DetailItem
}
interface State {
  loading: boolean;
  shareOpen: boolean;
}
class Main extends React.Component<Props, State> {
  public state = {
    loading: false,
    shareOpen: true
  }
  public id = '-1'
  public constructor(props: Props) {
    super(props)
    this.addContent = this.addContent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  public componentDidMount() {
    const { id } = this.props.match.params;
    if (id === '-1') {
      this.setState({ shareOpen: true })
    } else {
      this.fetchData()
    }
  }
  public componentWillUnmount() {
    APP.dispatch({
      type: `${namespace}/@@init`
    })
  }
  public addContent(type: 1 | 2 | 3) {
    const { detail } = this.props
    detail.list.push({
      type,
      sort: 0,
      list: [],
      crmCoupons: []
    })
    APP.dispatch({
      type: `${namespace}/changeDetail`,
      payload: { ...detail }
    })
  }
  public fetchData() {
    const id = this.props.match.params.id
    this.id = id
    if (id === '-1') {
      return
    }
    APP.dispatch({
      type: `${namespace}/fetchDetail`,
      payload: {
        id,
        cb: (result: any) => {
          this.setState({
            shareOpen: result.shareOpen === 1
          })
        }
      }
    })
  }
  requestParamsCreator(column: Special.DetailContentProps, list: any) {
    let items = (list || []).map((v: any) => {
      return {
        id: v.id,
        sort: v.sort
      }
    })
    return { type: column.type, css: column.css, sort: column.sort, items }
  }
  // 新增详情转换成入参
  public mapDetailToRequestParams(detail: Special.DetailItem) {
    detail.jumpUrl = (detail.jumpUrl || '').trim()
    const list = detail.list.map((column: Special.DetailContentProps) => {
      switch (column.type) {
        case 1:
          return this.requestParamsCreator(column, column.list);
        case 2:
          return this.requestParamsCreator(column, column.crmCoupons);
        case 3:
          return {
            type: column.type,
            sort: column.sort,
            advertisementUrl: (column.advertisementUrl || '').trim(),
            advertisementJumpUrl: (column.advertisementJumpUrl || '').trim()
          };
        default:
          return {};
      }
    })
    return {
      ...detail,
      list
    }
  }
  handleSwitch = (checked: boolean) => {
    this.setState({ shareOpen: checked });
  }
  public handleSubmit(e: any) {
    e.preventDefault()
    this.props.form.validateFields((err: any, value) => {
      if (err) {
        return
      }
      this.setState({
        loading: true
      })
      if (value.imgUrl instanceof Array) {
        value.imgUrl = value.imgUrl[0] && value.imgUrl[0].url
      }
      if (value.shareImgUrl instanceof Array) {
        value.shareImgUrl = value.shareImgUrl[0] && value.shareImgUrl[0].url
      }
      const params = {
        ...this.props.detail,
        ...value,
        shareOpen: this.state.shareOpen ? 1 : 0
      };
      console.log('params=>', params);
      const detail: any = this.mapDetailToRequestParams(params)
      api.saveSpecial(detail).then((res: any) => {
        this.setState({
          loading: false
        })
        if (res !== undefined) {
          APP.success(`专题${this.id === '-1' ? '新增' : '修改'}成功`)
          APP.history.push('/interface/special')
        }
      }, () => {
        this.setState({
          loading: false
        })
      })
    })
  }
  public get imgUrl(): string | { uid: string, url: string }[] {
    const { detail } = this.props
    return typeof detail.imgUrl === 'string' ? [
      {
        uid: 'imgUrl0',
        url: detail.imgUrl
      }
    ] : detail.imgUrl;
  }
  public get shareImgUrl(): string | { uid: string, url: string }[] {
    const { detail } = this.props
    return typeof detail.shareImgUrl === 'string' ? [
      {
        uid: 'imgUrl0',
        url: detail.shareImgUrl
      }
    ] : detail.shareImgUrl;
  }
  public render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
    };
    const { detail } = this.props
    return (
      <div className={styles.detail}>
        <div className={styles.content}>
          <Form
            className={styles.form}
            {...formItemLayout}
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              label='名称'
            >
              {getFieldDecorator('subjectName', {
                initialValue: detail.subjectName,
                rules: [
                  { required: true, message: '名称不能为空' }
                ]
              })(
                <Input placeholder='请输入专题名称' />
              )}
            </Form.Item>
            <Form.Item label="支持专题分享">
              <>
                <Switch checked={this.state.shareOpen} onChange={this.handleSwitch} />
                <p>关闭专题分享时，则隐藏专题页面分享按钮，无法分享专题。</p>
              </>
            </Form.Item>
            {this.state.shareOpen &&
              <>
                <Form.Item
                  label='分享标题'
                >
                  {getFieldDecorator('shareTitle', {
                    initialValue: detail.shareTitle,
                    rules: [
                      { required: true, message: '分享标题不能为空' },
                      {
                        max: 30,
                        message: '分享标题不能超过30个字符'
                      }
                    ]
                  })(
                    <Input placeholder='请输入分享标题' />
                  )}
                </Form.Item>
                <Form.Item label="分享图片" required>
                  {getFieldDecorator('shareImgUrl', {
                    initialValue: this.shareImgUrl,
                    rules: [
                      { required: true, message: '请上传专题分享图片' }
                    ]
                  })(<Upload accept="image/gif, image/jpeg, image/png" size={0.3} listType="picture-card" />)}
                  <p>1.专题分享图片主要用于专题分享，包括生成专题海报、分享给好友图片等，必填项。</p>
                  <p>2、图片格式支持png、gif、jpg格式（推荐使用png格式）。</p>
                  <p>3、图片尺寸为750*1000像素，大小不超过300kb。</p>
                </Form.Item>
              </>
            }
            <Form.Item
              label='专题背景色'
            >
              {getFieldDecorator('backgroundColor', {
                initialValue: detail.backgroundColor,
                rules: [
                  { required: true, message: '专题背景色不能为空' }
                ]
              })(
                <Input placeholder='请输入背景色，如#FFFFFF' />
              )}
            </Form.Item>
            <Form.Item
              label='banner图片'
              required
            >
              {getFieldDecorator('imgUrl', {
                initialValue: this.imgUrl,
                rules: [{
                  required: true,
                  message: 'banner图片不能为空'
                }]
              })(
                <Upload
                  size={0.3}
                  listType="picture-card"
                >
                </Upload>
              )}
            </Form.Item>
            <Form.Item
              label='链接'
            >
              {getFieldDecorator('jumpUrl', {
                initialValue: detail.jumpUrl,
                rules: [
                  { required: true, message: '请输入正确的链接地址' }
                ]
              })(
                <Input placeholder='请输入正确的链接地址' />
              )}
            </Form.Item>
            <Form.Item
              label='添加楼层'
            >
              <Button
                type="primary"
                className={styles.mr10}
                onClick={() => this.addContent(3)}
              >
                广告
              </Button>
              <Button type="primary" className={styles.mr10} onClick={() => this.addContent(2)}>优惠券</Button>
              <Button
                type="primary"
                onClick={() => this.addContent(1)}
              >
                商品
              </Button>
            </Form.Item>
            <Content />
            <div className={styles.footer}>
              <Button
                loading={this.state.loading}
                type="primary"
                htmlType="submit"
                style={{ marginRight: 20 }}
              >
                保存
              </Button>
              <Button
                onClick={() => {
                  APP.history.push('/interface/special')
                }}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(connect((state: any) => {
  return {
    detail: state[namespace].detail
  }
})(withRouter(Main)))
