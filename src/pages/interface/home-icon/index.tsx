import React from 'react'
import classNames from 'classnames'
import { Form, Input, Button, Upload, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
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
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };
  public render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 10
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
      <div>
        <div className={styles.header}>
          <div className={styles.tbtns}>
            {this.state.items.map((item) => <div className={styles.tbtn}>{item.title}</div>)}
            {this.state.items.length < 8 && <div
              className={classNames(styles.tbtn, styles.add)}
              onClick={this.addIconItem}
            >
              +新增icon
            </div>}
            <Button
              type="primary"
              className={styles.release}
              onClick={this.addIconItem}
            >
              发布
            </Button>
          </div>
        </div>
        <div className={styles.content}>
          <Form
            className={styles.form}
            {...formItemLayout}
          >
            <Form.Item
              label='icon名称'
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
                  listType="picture-card"
                  // className="avatar-uploader"
                  style={{width: 100, height: 100}}
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              )}
            </Form.Item>
            <Form.Item
              label='排序'
            >
              {getFieldDecorator('sort', {
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='内容配置'
            >
              {getFieldDecorator('content', {
              })(
                <Input />
              )}
            </Form.Item>
            <div className={styles.footer}>
              <Button
                type="primary"
              >
                保存
              </Button>
              <Button
                ghost
                type="danger"
              >
                删除
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(Main)
