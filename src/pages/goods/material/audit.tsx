import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { If } from '@/packages/common/components'
import { Input, Card, Button, message } from 'antd'
import Image from '@/components/Image'
import { ColumnProps } from 'antd/lib/table'
import { formItemLayout } from '@/config'
import Upload from '@/components/upload'
import { replaceHttpUrl } from '@/util/utils'
import * as api from './api'

// import { getCategory, saveRule, editRule } from './api'
const { TextArea } = Input
interface Props {
  onCancel: (value: boolean) => void
  dataSource?: any
  type?: string
  /** 是否审核 */
  actionType?: 'edit' | 'view' | 'audit'
}

interface State {
  /** 素材数据 */
  auditData: any
}
class Add extends React.Component<Props, State> {
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
      auditData: {}
    }
  }

  componentDidMount () {
    if (this.props.dataSource) {
      const { productId, productName, coverUrl, videoUrlList, pictureUrlList } = this.props.dataSource
      this.setState({
        auditData: Object.assign(this.props.dataSource, {
          productId,
          productName,
          coverUrl,
          videoUrl: videoUrlList,
          productImage: pictureUrlList
        })
      })
    }
  }

  /**
   * 审核素材
   * 审核状态（1：审核通过，2：审核拒绝）
   * */
  auditSave = (auditStatus: 1 | 2) => {
    const form = this.form.props.form
    const { dataSource, onCancel } = this.props
    form.validateFields((err: any, vals: any) => {
      if (!err) {
        const { auditMsg } = vals
        const params = {
          auditStatus,
          auditMsg
        }
        // 如果有传入值dataSource和素材Id那就是编辑，否则就是新增
        api.auditMaterial({ ...params, materialId: dataSource.id }).then(res => {
          message.success('审核成功')
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
    const { actionType } = this.props
    const { auditData } = this.state
    const isAudit = actionType === 'audit'
    const { authorPhone, author, productName, productId, content, videoUrl, productImage, auditMsg } = auditData
    console.log(auditData, 'auditData=====')
    return (
      <Card className='activity-add'>
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
          addonAfter={(
            <>
              <If condition={isAudit}>
                <FormItem {...formItemLayout}>
                  <Button type='primary' onClick={() => this.auditSave(1)}>
                    审核通过
                  </Button>
                  <Button className='ml20' onClick={() => this.auditSave(2)}>
                    不通过
                  </Button>
                  <Button className='ml20' onClick={this.handleCancel}>
                    取消
                  </Button>
                </FormItem>
              </If>
            </>
          )}
        >
          <FormItem
            label='活动商品Id'
          >
            {productId}
          </FormItem>
          <FormItem
            label='活动商品'
          >
            {productName}
          </FormItem>
          <FormItem
            label='发布人'
          >
            <span>{author}</span><span>{authorPhone}</span>
          </FormItem>
          <FormItem
            label='内容'
          >
            {content}
          </FormItem>
          <FormItem label='视频素材'>
            {videoUrl && videoUrl.length ? (
              <Upload
                listType='picture-card'
                fileType='video'
                value={[{
                  url: replaceHttpUrl(videoUrl)
                }]}
              />
            ) : '无'}
          </FormItem>
          <FormItem
            label='图片素材'
          >
            {Array.isArray(productImage) && productImage.length > 0
              ? productImage.map(img => (
                <Image
                  style={{
                    width: 102,
                    height: 102,
                    marginRight: 10,
                    marginBottom: 10
                  }}
                  key={img.url}
                  src={img.url}
                />
              ))
              : '无'}
          </FormItem>
          <If condition={!isAudit}>
            <FormItem label='审核意见'>
              {auditMsg ? auditMsg : '无'}
            </FormItem>
          </If>
          <If condition={isAudit}>
            <FormItem
              label='审核意见'
              inner={(form) => {
                return form.getFieldDecorator('auditMsg')(
                  <TextArea rows={4} placeholder='审核意见' />
                )
              }}
            >
            </FormItem>
          </If>
        </Form>
      </Card>
    )
  }
}

export default Add
