import React from 'react'
import { Modal, Input, Form, Button, Select, DatePicker } from 'antd'
import { addTimer } from './api'
import { XtSelect } from '@/components'
import _ from 'lodash'
import { FormComponentProps } from 'antd/lib/form'
import Upload from '@/components/upload/file'
const { RangePicker } = DatePicker;
import moment from 'moment';
const formItemLayout = {
  labelCol: {
    sm: { span: 6 }
  },
  wrapperCol: {
    sm: { span: 14 }
  }
};

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

  public constructor(props: Props) {
    super(props);
  }
  componentDidMount() {
    if (this.props.data.id) {
      this.setState({
        readonly: true
      })
      this.props.form.setFieldsValue({
        ...this.props.data,
        effectTime: moment(+this.props.data.effectTime),
        file: [{
          url: this.props.data.fileUrl,
          name: this.props.data.fileName
        }]
      })
    }
  }

  public componentWillReceiveProps(props: Props) {
    this.setState({
      visible: props.visible || false,
    })
  }
  public onOk = () => {
    if(this.props.data.id) return this.props.onOk()
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        addTimer({
          batchName: values.batchName,
          type: values.type,
          file: values.file[0].file,
          effectTime: values.effectTime.toDate().getTime()
        }).then((data:any) => {

        })
        if (this.props.onOk) {
          this.props.onOk(values)
          this.setState({
            visible: false
          })
        }
      }
    }
    )
  }
  public render() {
    const { visible, readonly } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title='商品批次'
        visible={visible}
        width={600}
        onOk={this.onOk}
        onCancel={() => {
          this.props.onCancel && this.props.onCancel()
        }}
      >
        <Form {...formItemLayout}>
          <Form.Item label="商品批次名称">
            {getFieldDecorator('batchName', {
              rules: [
                {
                  required: true,
                  message: '请输入商品批次名称'
                }
              ]
            })(<Input placeholder="请输入" disabled={readonly}/>)}
          </Form.Item>
          <Form.Item label="日期">
            {getFieldDecorator('effectTime', {
              rules: [
                {
                  required: true,
                  message: '请选择日期'
                }
              ]
            })(<DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              disabled={readonly}
              showTime
            />)}
          </Form.Item>
          <Form.Item label="操作类型">
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '请选择操作类型'
                }
              ]
            }
            )(<XtSelect disabled={readonly} data={[{ key: 1, val: '上线' }, { key: 2, val: '下线' }]} style={{ width: '174px' }} placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="上传文件">
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
                listType='text'
                listNum={1}
                accept='doc,xls'
                size={10}
                extname='xls,xlsx'
                fileTypeErrorText='请上传正确xls格式文件'
              >
                <span className={readonly ? 'disabled' : 'href'}>+添加文件</span>
              </Upload>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<Props>()(StoreTimerModal)
