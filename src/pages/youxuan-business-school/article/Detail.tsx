import React from 'react'
import { Form, FormItem, SelectFetch } from '@/packages/common/components'
import { FormInstance } from '@/packages/common/components/form'
import { Button, Card, Icon, Input, Switch, Table } from 'antd'
import { getAllColumn, saveDiscoverArticle, getDiscoverArticle, modifyDiscoverArticle } from './api'
import VideoUpload from '@/components/upload/VodVideo'
import { defaultFormConfig } from './config'
import UploadView from '@/components/upload'
import BraftEditor from 'braft-editor'
import GoodsModal from './GoodsModal'
import 'braft-editor/dist/index.css'
import { RouteComponentProps} from 'react-router'
interface State {
  products: any[]
}
class Main extends React.Component<RouteComponentProps<{id: string}>, State> {
  public state = {
    products: []
  }
  public formRef: FormInstance
  public modalRef: React.RefObject<GoodsModal> = React.createRef<GoodsModal>()
  public componentDidMount () {
    this.fetchData()
  }
  public async fetchData () {
    const id = this.props.match.params.id
    // 编辑
    if (id !== '-1') {
      const res = await getDiscoverArticle(id)
      this.formRef.setValues(res)
      this.setState({ products: res.products })
    }
  }
  public handleSubmit = (releaseStatus: number) => {
    const id = this.props.match.params.id
    this.formRef.props.form.validateFields(async (errs, vals) => {
      const productIds = this.state.products.map((item: any) => item.id)
      let res
      if (!errs) {
        // 新增
        if (id === '-1') {
          res = await saveDiscoverArticle({ ...vals, productIds, releaseStatus })
        } else {
          res = await modifyDiscoverArticle({ ...vals, id, productIds, releaseStatus })
        }
        if (res) {
          APP.success('操作成功')
          APP.history.goBack()
        }
      }
    })
  }
  public render () {
    const productIds = this.state.products.map((item: any) => item.id)
    return (
      <Card>
        <GoodsModal
          ref={this.modalRef}
          selectedRowKeys={productIds}
          onOk={(products: any[]) => {
            this.setState({ products })
          }}
        />
        <Form
          getInstance={ref => this.formRef = ref}
          config={defaultFormConfig}
        >
          <FormItem
            required
            label='栏目'
            inner={(form) => {
              return form.getFieldDecorator('columnId', {
                rules: [{
                  required: true,
                  message: '请选择栏目'
                }]
              })(
                <SelectFetch
                  fetchData={getAllColumn}
                  style={{ width: 196 }}
                />
              )
            }}
          />
          <FormItem
            name='memberLimit'
            verifiable
          />
          <FormItem
            name='title'
            label='标题'
            verifiable
            controlProps={{
              style: {
                width: 400
              },
              maxLength: 20
            }}
            placeholder='在这里输入标题，不超过20字'
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '在这里输入标题，不超过20字'
              }]
            }}
          />
          <FormItem
            label='支持分享'
            inner={(form) => {
              return form.getFieldDecorator('shareStatus')(
                <Switch
                  checkedChildren='开'
                  unCheckedChildren='关'
                />
              )
            }}
          />
          <FormItem
            required
            label='图片'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('coverImage')(
                    <UploadView
                      ossType='cos'
                      placeholder='上传首图'
                      listType='picture-card'
                      accept='image/png,image/jpeg,image/gif'
                      listNum={1}
                      size={0.3}
                    />
                  )}
                  <div>图片格式要求：png、jpeg、gif 尺寸建议：375px*211px</div>
                </div>
              )
            }}
          />
          <FormItem
            label='视频/音频'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('resourceUrl')(
                    <VideoUpload
                      listType='text'
                      accept='video/x-matroska,video/mp4,video/x-msvideo,audio/mpeg'
                      maxSize={1000 * 1024 * 1024}
                    >
                      <Button>
                        <Icon type='upload' />上传视频/音频
                      </Button>
                    </VideoUpload>
                  )}
                  <div>视频/音频上传，支持mkv、mp4、avi、mp3，（音视频发布有一定转码时间）</div>
                </div>
              )
            }}
          />
          <FormItem
            label='正文内容'
            name='contextType'
            controlProps={{
              onChange: () => {
                this.formRef.setValues({ context: undefined })
              }
            }}
          />
          <FormItem
            style={{ margin: 0 }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            inner={(form) => {
              const contextType = form.getFieldValue('contextType')
              return contextType === '1' ? (
                <FormItem
                  required
                  label='富文本'
                  inner={(form) => {
                    return form.getFieldDecorator('context', {
                      rules: [{
                        required: true,
                        message: '请输入正文'
                      }]
                    })(
                      <BraftEditor
                        style={{ border: '1px solid #d9d9d9'}}
                        placeholder='在这里输入正文'
                      />
                    )
                  }}
                />
              ): (
                <FormItem
                  label='链接'
                  inner={(form) => {
                    return form.getFieldDecorator('context', {
                      rules: [{
                        required: true,
                        message: '请输入链接'
                      }]
                    })(
                      <Input placeholder='在这里输入url' />
                    )
                  }}
                />
              )
            }}
          />
          <FormItem name='releaseTime' />
          <FormItem label='添加商品'>
            <div>
              <span
                className='href'
                onClick={() => {
                  this.modalRef.current?.open()
                }}
              >
                选择商品
              </span>
              <Table
                dataSource={this.state.products}
                columns={[{
                  title: '商品ID',
                  dataIndex: 'id'
                }, {
                  title: '商品名称',
                  dataIndex: 'productName'
                }, {
                  title: '库存',
                  dataIndex: 'stock',
                  render: (text) => {
                    return text > 10000 ? text / 10000 + '万' : text
                  }
                }, {
                  title: '操作',
                  render: (record, index) => {
                    return (
                      <span
                        className='href'
                        onClick={() => {
                          const { products } = this.state
                          products.splice(index, 1)
                          this.setState({ products })
                        }}
                      >
                        删除
                      </span>
                    )
                  }
                }]}
              />
            </div>
          </FormItem>
          <FormItem name='virtualRead' />
          <FormItem>
            <Button type='primary' onClick={() => this.handleSubmit(30)}>提交</Button>
            <Button className='ml10' onClick={() => this.handleSubmit(10)}>保存草稿</Button>
            <Button className='ml10' onClick={() => APP.history.goBack()}>取消</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Main