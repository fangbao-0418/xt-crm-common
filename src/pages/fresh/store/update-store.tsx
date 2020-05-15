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
      </Form>
      </Modal>
    )
  }
}

export default Form.create<Props>()(StoreTimerModal)
