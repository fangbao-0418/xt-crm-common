import React from 'react'
import { Modal, Input, Form, Button, Select, DatePicker, message } from 'antd'
import { addTimer } from './api'
import { XtSelect } from '@/components'
import _ from 'lodash'
import { FormComponentProps } from 'antd/lib/form'
import Upload from '@/components/upload/file'
const { RangePicker } = DatePicker
import moment from 'moment'
const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 14 }
  }
}

export interface Props extends FormComponentProps {
  visible?: boolean
  data: any,
  onOk: (data?: any) => void
  onCancel: () => void
}
export interface State extends PageProps<Coupon.CouponItemProps> {
  visible: boolean
  readonly: boolean

}
export interface SearchPayload {
  code?: string
  isDelete?: 0
  name?: string
  page: number
  pageSize?: number
  status?: number
  /** 手动发券 1 是 0 否 */
  receivePattern?: 0 | 1
}
class StoreTimerModal extends React.Component<Props, State> {
  public payload: SearchPayload = {
    isDelete: 0,
    page: 1,
    receivePattern: 0
  }
  public state: State = {
    current: 1,
    readonly: false,
    size: 10,
    records: [],
    total: 0,
    visible: this.props.visible || false
  }

  public constructor (props: Props) {
    super(props)
  }
  componentDidMount () {
    if (this.props.data.id) {
      this.setState({
        readonly: true
      })
      this.props.form.setFieldsValue({
        ...this.props.data,
        actionTime: moment(+this.props.data.actionTime),
        file: [{
          url: this.props.data.fileDownUrl,
          name: this.props.data.fileName
        }]
      })
    } else {
      this.setState({
        readonly: false
      })
      this.props.form.resetFields()
    }
  }

  public componentWillReceiveProps (props: Props) {
    this.setState({
      visible: props.visible || false
    })
  }
  public onOk = () => {
    if (this.props.data.id) {
      return this.props.onOk()
    }
    this.props.form.validateFields(async (errors, values) => {

      if (!errors) {
        addTimer({
          name: values.name,
          actionType: values.actionType,
          file: values.file[0].file,
          actionTime: values.actionTime.toDate().setMilliseconds(0)
        }).then((data:any) => {
          if (this.props.onOk && data) {
            message.success('新建成功')
            this.props.onOk(true)
            this.setState({
              visible: false
            })
          }
        })

      }
    })
  }
  public render () {
    const { visible, readonly } = this.state
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='门店批次'
        visible={visible}
        width={600}
        onOk={this.onOk}
        onCancel={() => {
          this.props.onCancel && this.props.onCancel()
        }}
      >
        <Form {...formItemLayout}>
          <Form.Item label='门店批次名称'>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入门店批次名称'
                }
              ]
            })(<Input maxLength={20} placeholder='请输入' disabled={readonly} />)}
          </Form.Item>
          <Form.Item label='日期'>
            {getFieldDecorator('actionTime', {
              rules: [
                {
                  required: true,
                  message: '请选择日期'
                }
              ]
            })(<DatePicker
              format='YYYY-MM-DD HH:mm:ss'
              disabled={readonly}
              showTime
            />)}
          </Form.Item>
          <Form.Item label='操作类型'>
            {getFieldDecorator('actionType', {
              rules: [
                {
                  required: true,
                  message: '请选择操作类型'
                }
              ]
            })(<XtSelect disabled={readonly} data={[{ key: 1, val: '上线' }, { key: 0, val: '下线' }]} style={{ width: '174px' }} placeholder='请选择' />)}
          </Form.Item>
          <Form.Item label='上传文件'>
            {getFieldDecorator('file', {
              rules: [
                {
                  required: true,
                  message: '请上传文件'
                }
              ]
            })(
              <Upload
                disabled={readonly}
                listactionType='text'
                listNum={1}
                accept='doc,xls'
                size={10}
                extname='xls,xlsx'
                fileactionTypeErrorText='请上传正确xls格式文件'
              >
                <span className={readonly ? 'disabled' : 'href'}>+添加文件</span>
              </Upload>
            )}
          </Form.Item>
          {!readonly && <Form.Item label='模板'><a href='https://assets.hzxituan.com/upload/2020-05-01/%E9%97%A8%E5%BA%97%E6%89%B9%E6%AC%A1%E6%A8%A1%E6%9D%BF.xlsx' target='_blank'>门店批次模板.xlsx</a></Form.Item>}
        </Form>
      </Modal>
    )
  }
}

export default Form.create<Props>()(StoreTimerModal)
