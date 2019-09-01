import React from 'react'
import classNames from 'classnames'
import { Form, Input, Button, Icon, Card, Radio, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import Upload from '@/components/upload'
import Content from './components/content'
import styles from './style.module.sass'
interface Props extends FormComponentProps {}
function getBase64 (img: File, callback?: (result?: any) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    if (callback) {
      callback(reader.result)
    }
  });
  reader.readAsDataURL(img);
}
class Main extends React.Component<Props> {
  public state = {
    imageUrl: '',
    loading: false,
    items: [
      {title: '体验团长'},
      {title: '喜团优选'},
      {title: '新人专享'},
    ]
  }
  public constructor (props: Props) {
    super(props)
    this.addIconItem = this.addIconItem.bind(this)
  }
  public componentDidMount () {
    //
  }
  public mapper (fn: any): any {
    return 
  }
  public addIconItem () {
    this.setState({
      items: this.state.items.concat([{title: ''}])
    })
  }
  public handleChange = (info: any) => {
    console.log(info, 'info')
  };
  public render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state
    return (
      <div className={styles.detail}>
        <div className={styles.content}>
          <Form
            className={styles.form}
            {...formItemLayout}
          >
            <Form.Item
              label='名称'
            >
              {getFieldDecorator('name', {
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='分享标题'
            >
              {getFieldDecorator('name', {
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='专题背景色'
            >
              {getFieldDecorator('name', {
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='上传图片'
            >
              {getFieldDecorator('imageUrl', {
              })(
                <Upload
                  size={100}
                  listType="picture-card"
                  // className="avatar-uploader"
                  style={{width: 100, height: 100}}
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                </Upload>
              )}
            </Form.Item>
            <Form.Item
              label='添加楼层'
            >
              <Button type="primary" className={styles.mr10}>广告</Button>
              <Button type="primary" className={styles.mr10}>优惠券</Button>
              <Button type="primary">商品</Button>
            </Form.Item>
            <Content />
            <div className={styles.footer}>
              <Button
                type="primary"
                style={{marginRight: 20}}
              >
                保存
              </Button>
              <Button
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
export default Form.create()(Main)
