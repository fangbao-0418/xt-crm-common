import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import DraggableUpload from '@/components/draggable-upload'
import UploadView, { VideoUpload } from '@/components/upload'
import { If } from '@/packages/common/components'
import { Input, Card, Button, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { formItemLayout } from '@/config'
import ShopList from '@/components/shop/List'
import ShopSelectModal, { ShopModalInstance } from '@/components/shop/SelectModal'
import * as api from './api'
import styles from './style.module.scss'

// import { getCategory, saveRule, editRule } from './api'
const { Search, TextArea } = Input
interface Props {
  onCancel: (value: boolean) => void
  dataSource?: any
  type?: string
}

interface State {
  /** 发布人昵称 */
  nickName: string
  /** 发布人手机号 */
  userPhone: string
  /** 是否已经校验过发布人 */
  isCheckPhone: boolean
}
class Add extends React.Component<Props, State> {
  public shopModalInstance: ShopModalInstance
  public form: FormInstance
  public propsColumns: ColumnProps<Shop.ShopItemProps>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      width: 150
    },
    {
      title: '商品名称',
      width: 240,
      dataIndex: 'productName',
      render: (text, record) => {
        return (
          <div>
            <div>
              {/* <Image
                src={record.coverUrl}
                width={80}
                height={80}
              /> */}
            </div>
            <div>
              <div>{text}</div>
              {/* <div>库存：{record.stock}</div> */}
            </div>
          </div>
        )
      }
    }
  ]
  constructor (props: Props) {
    super(props)
    this.state = {
      nickName: '',
      userPhone: '',
      isCheckPhone: false
    }
  }

  componentDidMount () {
    if (this.props.dataSource) {
      const { productId, productName, coverUrl, videoUrlList, pictureUrlList } = this.props.dataSource
      this.form.props.form.setFieldsValue(
        Object.assign(this.props.dataSource, {
          productId: {
            spuList: [{
              id: productId,
              productName,
              coverUrl
            }]
          },
          videoUrl: videoUrlList,
          productImage: pictureUrlList
        })
      )
      this.setState({
        isCheckPhone: true
      })
    }
  }
  /**
 * @memberof Add
 * 通过手机号查找发布人
 */
  public searchUserByPhone = (searchPhone: string) => {
    if (!searchPhone) {
      return message.error('请输入发布人手机号')
    }
    api.fetchUserInfo({
      phone: searchPhone
    }).then((res: {nickName: string, phone: string}) => {
      // 用户名
      if (res) {
        const { nickName, phone } = res
        this.setState({
          userPhone: phone,
          isCheckPhone: true,
          nickName
        })
      } else {
        APP.error('手机号码不存在')
      }
    })
  }

  /**
   * 新增/编辑素材保存
   *
   * @memberof Add
   */
  handleSave = () => {
    const form = this.form.props.form
    const { dataSource, onCancel } = this.props
    const { isCheckPhone } = this.state
    if (!isCheckPhone) {
      return message.info('请核验发布人是否正确')
    }
    form.validateFields((err: any, vals: any) => {
      if (!err) {
        const { productId, authorPhone, content, videoUrl, productImage } = vals
        const params = {
          productId: productId.spuList[0].id,
          authorPhone,
          content,
          videoUrlList: videoUrl && videoUrl.map((video: any) => {
            return { url: video.url, size: video.size }
          }),
          pictureUrlList: productImage && productImage.map((img: any) => {
            return { url: img.rurl, size: img.size }
          })
        }
        let p: Promise<any>
        // 如果有传入值dataSource和素材Id那就是编辑，否则就是新增
        if (dataSource && dataSource.id) {
          p = api.editProductMaterial({ ...params, id: dataSource.id }).then(res => {
            message.success('修改成功')
          })
        } else {
          p = api.addProductMaterial(params).then(res => {
            message.success('添加成功')
          })
        }
        p.then(res => {
          onCancel(false)
        })
      }
    })
  }

  /**
   * @memberof Add
   * 关闭弹窗
   */
  handleCancel = () => {
    this.props.onCancel(false)
  }

  render () {
    const { nickName, userPhone } = this.state
    return (
      <Card className='activity-add'>
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
          addonAfter={(
            <FormItem {...formItemLayout}>
              <Button type='primary' onClick={this.handleSave}>
                保存
              </Button>
              <Button className='ml20' onClick={this.handleCancel}>
                取消
              </Button>
            </FormItem>
          )}
        >
          <FormItem
            label='活动商品'
            required
            inner={(form) => {
              return (
                <div>
                  <span
                    className='href'
                    onClick={() => {
                      this.shopModalInstance.open()
                    }}
                  >
                    请选择商品
                  </span>
                  {
                    form.getFieldDecorator(
                      'productId',
                      {
                        rules: [
                          {
                            validator: (rules, value, cb) => {
                              if (value && value.spuList && value.spuList.length > 0) {
                                cb()
                              } else {
                                cb('请选择活动商品')
                              }
                            }
                          }
                        ]
                      }
                    )(
                      <ShopList
                        isShowPagination={false}
                        propsColumns={this.propsColumns}
                      />
                    )
                  }
                </div>
              )
            }}
          />
          <FormItem
            label='发布人'
            required
            inner={(form) => {
              return (
                <div>
                  {
                    form.getFieldDecorator('authorPhone', {
                      rules: [
                        {
                          required: true,
                          message: '请填写发布人'
                        }
                      ]
                    })(
                      <Search
                        onSearch={value => this.searchUserByPhone(value)}
                        onChange={() => {
                          this.setState({
                            nickName: '',
                            userPhone: '',
                            isCheckPhone: false
                          })
                        }}
                        enterButton='核验'
                        style={{ width: '260px' }}
                        maxLength={11}
                        placeholder='请输入发布人手机号查询'
                      />
                    )
                  }
                  {
                    nickName ? <div>昵称：{nickName}</div> : userPhone ? <div>手机号: {userPhone}</div> : ''
                  }
                </div>
              )
            }}
          >
          </FormItem>
          <FormItem
            label='内容'
            required
            inner={(form) => {
              return form.getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请填写内容'
                  },
                  {
                    min: 5,
                    message: '不能少于5个字符'
                  },
                  {
                    max: 250,
                    message: '不能大于250个字符'
                  }
                ]
              })(<TextArea rows={4} placeholder='备注' />)
            }}
          >
          </FormItem>
          <FormItem
            label='视频素材'
            inner={(form) => {
              return (
                <>
                  {
                    form.getFieldDecorator('videoUrl')(
                      // <UploadView
                      //   placeholder='上传视频'
                      //   fileType='video'
                      //   listType='picture-card'
                      //   listNum={3}
                      //   size={15}
                      // />
                      <VideoUpload
                        maxCount={3}
                        maxSize={15 * 1024 * 1024}
                        onChange={() => {
                          this.form.setValues({
                            productImage: undefined
                          })
                        }}
                      />
                    )
                  }
                  <div>（15M(兆)以内，最多可添加3个）</div>
                </>
              )
            }}
          />
          <FormItem
            label='图片素材'
            inner={(form) => {
              return (
                <div>
                  <div>
                    {form.getFieldDecorator('productImage')(
                      <DraggableUpload
                        className={styles['goods-draggable']}
                        listNum={16}
                        size={0.3}
                        ossType='cos'
                        placeholder='上传商品图片'
                        onChange={() => {
                          this.form.setValues({
                            videoUrl: undefined
                          })
                        }}
                      />
                    )}
                  </div>
                  <div>（建议750*750px，300kb以内，最多可添加16张）</div>
                </div>
              )
            }}
          />
        </Form>
        <ShopSelectModal
          api={api.getGoodsList}
          getInstance={(ref) => {
            this.shopModalInstance = ref
          }}
          onOk={(rows) => {
            const values = this.form.getValues()
            const value = {
              ...values.productId,
              spuList: rows
            }
            this.form.setValues({
              ['productId']: value
            })
            this.shopModalInstance.hide()
          }}
          checkType='radio'
        />
      </Card>
    )
  }
}

export default Add
