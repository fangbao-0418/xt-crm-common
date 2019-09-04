import React from 'react'
import classNames from 'classnames'
import { Form, Input, Button, Popconfirm } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import * as api from './api'
import Upload from '@/components/upload'
import styles from './style.module.sass'
interface Props extends FormComponentProps {}
interface State {
  dataSource:  HomeIcon.ItemProps[]
  selectIndex: number
  loading: boolean
}
class Main extends React.Component<Props, State> {
  public state: State = {
    dataSource: [],
    selectIndex: -2,
    loading: false
  }
  public constructor (props: Props) {
    super(props)
    this.addIconItem = this.addIconItem.bind(this)
    this.toSave = this.toSave.bind(this)
    this.toDelete = this.toDelete.bind(this)
    this.toPublish = this.toPublish.bind(this)
  }
  public componentDidMount () {
    this.fetchList()
  }
  public fetchList (init = true) {
    api.getIconList().then((res: any = []) => {
      this.setState({
        dataSource: res || []
      })
      if (init) {
        const item = res[0] || {}
        this.props.form.setFieldsValue(item)
      }
    })
  }
  public toSave () {
    this.props.form.validateFields((err, value: any) => {
      if (err) {
        return
      }
      const { dataSource, selectIndex } = this.state
      if (selectIndex < dataSource.length) {
        const detail = dataSource[selectIndex]
        const result = {
          ...detail,
          ...value
        }
        if (result.imgUrl instanceof Array) {
          result.imgUrl = result.imgUrl[0].url
        }
        this.setState({
          loading: true
        })
        if (result.id) {
          api.saveIcon(result).then((res: any) => {
            console.log(res, 'res')
            if (res) {
              dataSource[selectIndex] = result
              this.setState({
                dataSource
              })
              APP.success('保存icon成功')
            }
          }).finally(() => {
            this.setState({
              loading: false
            })
          })
        } else {
          api.addIcon(result).then(() => {
            this.fetchList(false)
            this.resetForm()
            APP.success('新增icon成功')
          }).finally(() => {
            this.setState({
              loading: false
            })
          })
        }
      }
    })
  }
  public addIconItem () {
    this.resetForm()
  }
  public resetForm () {
    this.props.form.resetFields()
    this.setState({
      selectIndex: -1
    })
  }
  public initValue (index: number) {
    const { dataSource } = this.state
    this.setState({
      selectIndex: index
    }, () => {
      const result = dataSource[index]
      if (typeof result.imgUrl === 'string') {
        result.imgUrl = [{
          uid: 'imgurl',
          url: result.imgUrl
        }]
      }
      this.props.form.setFieldsValue(dataSource[index])
    })
  }
  public toDelete () {
    const { dataSource, selectIndex } = this.state
    if (selectIndex > -1) {
      api.deleteIcon(dataSource[selectIndex].id).then(() => {
        dataSource.splice(selectIndex, 1)
        this.setState({
          dataSource
        }, () => {
          this.resetForm()
        })
      })
    }
  }
  public toPublish () {
    api.publishIcon().then(() => {
      APP.success('发布icon成功')
    })
  }
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
    const { dataSource, selectIndex } = this.state
    return (
      <div style={{minHeight: 400, background: 'white'}}>
        <div className={styles.header}>
          <div className={styles.tbtns}>
            {
              dataSource.map((item, index) => (
                <div
                  key={index}
                  className={classNames(styles.tbtn, {[styles.active]: selectIndex === index })}
                  onClick={() => {
                    this.initValue(index)
                  }}
                >
                  {item.title}
                </div>
              )
            )}
            {
              dataSource.length < 8 && <div
                className={classNames(styles.tbtn, styles.add)}
                onClick={this.addIconItem}
              >
                +新增icon
              </div>
            }
            <Popconfirm
              title='确认发布icon吗'
              onConfirm={this.toPublish}
            >
              <Button
                type="primary"
                className={styles.release}
              >
                发布
              </Button>
            </Popconfirm>
          </div>
        </div>
        {
          selectIndex > -2 && (
            <div className={styles.content}>
              <Form
                className={styles.form}
                {...formItemLayout}
              >
                <Form.Item
                  label='icon名称'
                >
                  {getFieldDecorator('title', {
                    rules: [
                      {required: true, message: 'icon名称不能为空'}
                    ]
                  })(
                    <Input />
                  )}
                </Form.Item>
                <Form.Item
                  label='上传图片'
                >
                  {getFieldDecorator('imgUrl', {
                    rules: [
                      {required: true, message: '上传图片不能为空'}
                    ]
                  })(
                    <Upload
                      size={0.02}
                      listType="picture-card"
                      style={{width: 100, height: 100}}
                    >
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
                  {getFieldDecorator('jumpUrl', {
                  })(
                    <Input />
                  )}
                </Form.Item>
                <div className={styles.footer}>
                  <Button
                    loading={this.state.loading}
                    type="primary"
                    onClick={this.toSave}
                  >
                    保存
                  </Button>
                  <Popconfirm
                    disabled={selectIndex <= -1}
                    title='确认删除icon吗'
                    onConfirm={this.toDelete}
                  >
                    <Button
                      disabled={selectIndex <= -1}
                      ghost
                      type="danger"
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </Form>
            </div>
          )
        }
      </div>
    )
  }
}
export default Form.create()(Main)
