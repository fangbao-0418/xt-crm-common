import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import DraggableUpload from '@/components/draggable-upload'
import UploadView from '@/components/upload'
import Image from '@/components/Image'
import { Input, Select, InputNumber, Card, Button, message, Table, Row, Col } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { formItemLayout } from '@/config'
import ShopList from '@/components/shop/List'
import ShopSelectModal, { ShopModalInstance } from '@/components/shop/SelectModal'
import * as api from './api'
import styles from '../style.module.scss'

// import { getCategory, saveRule, editRule } from './api'
const { Search, TextArea } = Input
interface InitProps {
  onCancel: (value: boolean) => void
  editSource?: {
    name: string
    goods: object
    remark: string
  }
  type?: string
}

interface InitState {
  loading: boolean
  categorys: []
  userName: string
  userPhone: string
}
class Add extends React.Component<InitProps, InitState> {
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
              <Image
                src={record.coverUrl}
                width={80}
                height={80}
              />
            </div>
            <div>
              <div>{record.productName}</div>
              {/* <div>库存：{record.stock}</div> */}
            </div>
          </div>
        )
      }
    }
  ]
  constructor (props: InitProps) {
    super(props)
    this.state = {
      loading: false, // 保存活动按钮
      categorys: [],
      userName: '',
      userPhone: ''
    }
  }

  componentDidMount () {
  }
/**
 * @memberof Add
 * 通过手机号查找发布人
 */
  public searchUserByPhone = (phone: string) => {
    api.fetchUserInfo({
      phone
    }).then((res: {userName: string, phone: string}) => {
      // 用户名
      const { userName, phone } = res
      this.setState({
        userPhone: phone,
        userName
      })
    })
  }

  /**
   * 新增素材保存
   *
   * @memberof Add
   */
  handleSave = () => {
    const form = this.form.props.form
    form.validateFields((err: any, vals: any) => {
      if (!err) {
        const { productId, authorPhone, content, videoUrl, productImage } = vals
        console.log(vals, 'vals')
        console.log(productId.spuList.map((item: any) => item.id), 'productId')
        const params = {
          productId: productId.spuList.map((item: any) => item.id),
          authorPhone,
          content,
          videoUrlList: videoUrl || [].map((video: any) => {return {url: video.url}})
        }
        console.log(params, 'params')
        api.addProductMaterial(params).then(res => {
          console.log(res, 'res')
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
    const {
      // form: { getFieldDecorator },
      onCancel,
      editSource,
      type
    } = this.props
    const {userName, userPhone} = this.state
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
                  <div>
                    <span
                      className='href'
                      onClick={() => {
                        this.shopModalInstance.open()
                      }}
                    >
                      请选择商品
                    </span>
                  </div>
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
                      initialValue: editSource && editSource.goods || '',
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
                            userName: '',
                            userPhone: ''
                          })
                        }}
                        style={{width: '260px'}}
                        maxLength={11}
                        enterButton
                        placeholder='请输入发布人手机号查询'
                      />
                    )
                  }
                  {
                    userName ? <div>昵称：{userName}</div> : userPhone ? <div>手机号: {userPhone}</div> : ''
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
              return  form.getFieldDecorator('content', {
                initialValue: editSource && editSource.remark,
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
              return form.getFieldDecorator('videoUrl')(
                <UploadView
                  placeholder='上传视频'
                  fileType='video'
                  listType='picture-card'
                  listNum={1}
                  size={15}
                />
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
                        listNum={3}
                        size={0.3}
                        ossType='cos'
                        placeholder='上传商品图片'
                      />
                    )}
                    </div>
                  <div>（建议750*750px，300kb以内，最多可添加5张）</div>
                </div>
              )
            }}
          />
        </Form>
        <ShopSelectModal
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
