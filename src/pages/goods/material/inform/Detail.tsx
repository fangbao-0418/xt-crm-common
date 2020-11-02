import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig, TypeEnum } from './config'
import Image from '@/components/Image'
import { Radio, Button } from 'antd'
import * as api from './api'
import styles from './style.module.styl'
import { ReplyInfoProps, RecordProps } from './interface'

function ReportInfo (props: ReplyInfoProps) {
  return (
    <div className={styles['report-info']}>
      <div className='clear'>
        <div className={styles['report-info-avatar']}>
          <img src={props.headImage} />
        </div>
        <div className={styles['report-info-info']}>
          <div>{props.nickName}</div>
          <div>{APP.fn.formatDate(props.createTime)}</div>
        </div>
      </div>
      <div>{props.content}</div>
    </div>
  )
}

interface Props {
  id: number
  onOk?: () => void
  onCancel?: () => void
}

interface State {
  record: RecordProps
}

const contents = [
  '经初步核实，您举报的评论暂未能核实到{举报原因}信息，我们会对此评论持续关注，一旦核实到{举报原因}会及时处理，感谢您的反馈！',
  '经核实，您举报的评论为{举报原因}，我们已对此评论删除处理，感谢您的反馈！'
]

class Main extends React.Component<Props, State> {
  public form: FormInstance
  public state: State = {
    record: {
      replyInfo: {}
    } as any
  }
  public componentDidMount () {
    api.fetchDetail(this.props.id).then((res) => {
      res.reportResult = res.status === 3 ? '2' : '1'
      const content = res.reportResult === '1' ? contents[0] : contents[1]
      res = {
        ...res,
        feedbackWord: content.replace(/{举报原因}/g, TypeEnum[res.type])
      }
      this.setState({
        record: res
      })
      this.form.setValues(res)
    })
  }
  public toAudit () {
    const { record } = this.state
    const content = record.reportResult === '1' ? contents[0] : contents[1]
    api.auditReport({
      id: record.id,
      status: Number(record.reportResult),
      feedbackWord: content.replace(/{举报原因}/g, TypeEnum[record.type])
    }).then(() => {
      this.props?.onOk?.()
    })
  }
  public render () {
    const { record } = this.state
    console.log(record, 'record')
    return (
      <div className={styles.detail}>
        <Form
          config={getFieldsConfig()}
          readonly
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          <FormItem label='举报理由' name='type' />
          <FormItem name='description' />
          <FormItem label='图片证据'>
            {record.imageUrls?.map((item) => {
              return (
                <Image src={item} className='mr10 mb10' />
              )
            }) || '无'}
          </FormItem>
          <FormItem label='举报评论'>
            <div style={{ marginTop: 10 }}>
              <ReportInfo {...record.replyInfo} />
            </div>
          </FormItem>
          <FormItem label='相关商品名称'>
            <span
              className='href'
              onClick={() => {
                APP.open(`/goods/sku-sale/${record.productId}`)
              }}
            >
              {record.productName}
            </span>
          </FormItem>
          <FormItem label='举报结果'>
            <Radio.Group
              value={record.reportResult}
              buttonStyle="solid"
              onChange={(e) => {
                if (record.status !== 1) {
                  return
                }
                const value = e.target.value
                record.reportResult = value
                const content = value === '1' ? contents[0] : contents[1]
                record.feedbackWord = content.replace(/{举报原因}/g, TypeEnum[record.type])
                this.setState({
                  record
                })
                this.form.setValues(record)
              }}
            >
              <Radio.Button value="1">举报属实</Radio.Button>
              <Radio.Button value="2">无效举报</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem
            name='feedbackWord'
          >
            <div
              style={{
                border: '1px solid rgb(217 217 217)',
                lineHeight: 1.5,
                padding: '10px 10px 40px'
              }}
            >
              {record.feedbackWord}
            </div>
          </FormItem>
          <FormItem hidden={record.status !== 1}>
            <Button type='primary' className='mr10' onClick={this.toAudit.bind(this)}>
              提交
            </Button>
            <Button type='primary' onClick={this.props.onCancel}>
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Main