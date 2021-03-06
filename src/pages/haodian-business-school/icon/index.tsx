import React from 'react'
import classNames from 'classnames'
import { Form, Input, Button, Checkbox, Popconfirm, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import * as api from './api'
import Upload from '@/components/upload'
import If from '@/packages/common/components/if'
import styles from './style.module.sass'
import platformType from '@/enum/platformType'
const _platformType = platformType.getArray({ key: 'value', val: 'label' }).filter(v => ['8', '16'].includes(v.value))

interface Props extends FormComponentProps { }
interface State {
  dataSource: HomeIcon.ItemProps[]
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
        item.imgUrl = [{ url: item.imgUrl, uid: 'imgurl' }]
        this.props.form.setFieldsValue(item)
      }
    })
  }
  public toSave () {
    this.props.form.validateFields((err, value: any) => {
      if (err) {
        return
      }
      value.jumpUrl = (value.jumpUrl || '').trim()
      const { dataSource, selectIndex } = this.state
      if (selectIndex < dataSource.length) {
        const detail = dataSource[selectIndex]
        const result = {
          ...detail,
          ...value
        }
        if (result.imgUrl instanceof Array) {
          result.imgUrl = result.imgUrl[0].rurl
        }
        result.platform = 0
        result.platformArray.forEach((val:any) => {
          result.platform += val*1
        })
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
            if (this.state.dataSource.length >= 7) {
              this.setState({
                selectIndex: -2
              })
              return
            }
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
    this.props.form.setFieldsValue({
      platformArray: _platformType.map(val => val.value)
    })
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
      if (result.platform) {
        const str = result.platform.toString(2)
        const array = str.split('')
        result.platformArray = []
        array.forEach((val: any, i) => {
          if (val * 1 == 1) {
            result.platformArray.push(Math.pow(2, array.length - 1 - i).toString())
          }
        })
      } else {
        result.platformArray = _platformType.map(val => val.value)
      }
      //   result.platformArray =
      //    result.platformStr = result.platformStr ? result.platformStr.split(',') : _platformType.map(val => val.value)
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
    const { dataSource } = this.state
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
      }
    }
    const { dataSource, selectIndex } = this.state
    return (
      <div style={{ minHeight: 400, background: 'white' }}>
        <div className={styles.header}>
          <div className={styles.tbtns}>
            {
              dataSource.map((item, index) => (
                <div
                  key={index}
                  className={classNames(styles.tbtn, { [styles.active]: selectIndex === index })}
                  onClick={() => {
                    this.initValue(index)
                  }}
                >
                  {item.title}
                </div>
              ))
            }
            <div
              className={classNames(styles.tbtn, styles.add)}
              onClick={this.addIconItem}
            >
              +新增icon
            </div>
            {/* <If condition={dataSource.length >= 10}> */}
              <Popconfirm
                title='确认发布icon吗'
                onConfirm={this.toPublish}
              >
                <Button
                  type='primary'
                  className={styles.release}
                >
                  发布
                </Button>
              </Popconfirm>
            {/* </If> */}
            {/* <If condition={dataSource.length < 10}>
              <Button
                type='primary'
                className={styles.release}
                onClick={() => {
                  Modal.error({
                    title: '限制发布提示',
                    content: 'icon个数必须大于10个以上才能发布~'
                  })
                }}
              >
                发布
              </Button>
            </If> */}
          </div>
        </div>
        <div className={styles.content} style={{ display: selectIndex > -2 ? '' :'none' }}>
          <Form
            className={styles.form}
            {...formItemLayout}
          >
            <Form.Item
              label='icon名称'
              extra='五个字以内'
            >
              {getFieldDecorator('title', {
                rules: [
                  { required: true, message: 'icon名称不能为空' }
                ]
              })(
                <Input maxLength={5} placeholder='请输入' />
              )}
            </Form.Item>
            <Form.Item
              label='上传图片'
            >
              {getFieldDecorator('imgUrl', {
                rules: [
                  { required: true, message: '上传图片不能为空' }
                ]
              })(
                <Upload
                  size={0.05}
                  listType='picture-card'
                  style={{ width: 100, height: 100 }}
                >
                </Upload>
              )}
            </Form.Item>
            <Form.Item
              label='排序'
            >
              {getFieldDecorator('sort', {
                rules: [
                  { required: true, message: '排序不能为空' }
                ]
              })(
                <Input placeholder='请输入' />
              )}
            </Form.Item>
            <Form.Item
              label='内容配置'
            >
              {getFieldDecorator('jumpUrl', {
                rules: [
                  { required: true, message: '内容配置不能为空' }
                ]
              })(
                <Input placeholder='请输入' />
              )}
            </Form.Item>
            <Form.Item label='平台'>
              {getFieldDecorator('platformArray', {
                rules: [{
                  required: true,
                  message: '请选择平台'
                }]
              })(
                <Checkbox.Group options={_platformType}> </Checkbox.Group>
              )}
            </Form.Item>
            <div className={styles.footer}>
              <Button
                loading={this.state.loading}
                type='primary'
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
                  type='danger'
                >
                  删除
                </Button>
              </Popconfirm>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(Main)
