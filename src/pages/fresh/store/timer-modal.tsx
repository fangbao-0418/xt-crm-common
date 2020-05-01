import React from 'react'
import { Modal, Input, Form, Button, Select } from 'antd'
import { XtSelect } from '@/components'
import _ from 'lodash'
import { FormComponentProps } from 'antd/lib/form'
import Upload from '@/components/upload/file'

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
  onOk?: () => void
  onCancel?: () => void
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
  public selectedRows: Coupon.CouponItemProps[] = []

  public constructor(props: Props) {
    super(props)
    this.onOk = this.onOk.bind(this)
  }
  public componentWillReceiveProps(props: Props) {
    this.setState({
      visible: props.visible || false,
    })
  }
  public onOk() {
    if (this.props.onOk) {
      this.props.onOk()
      this.setState({
        visible: false
      })
    }
  }
  public componentDidMount() {
    this.fetchData()
  }
  public fetchData() {
    const fields = this.props.form.getFieldsValue();
  }

  public render() {
    const { visible, readonly } = this.state;
    const { getFieldDecorator, resetFields } = this.props.form;
    return (
      <Modal
        title='选择优惠券'
        visible={visible}
        width={600}
        onOk={this.onOk}
        onCancel={() => {
          if (this.props.onCancel) {
            this.props.onCancel()
          } else {
            this.setState({
              visible: false
            })
          }
        }}
      >
        <Form {...formItemLayout}>
          <Form.Item label="商品批次名称">
            {getFieldDecorator('code', {
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: '请输入商品批次名称'
                }
              ]
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="日期">
            {getFieldDecorator('name', {
              initialValue: '1',
              rules: [
                {
                  required: true,
                  message: '请选择日期'
                }
              ]
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="操作类型">
            {getFieldDecorator('status', {
              initialValue: '1',
              rules: [
                {
                  required: true,
                  message: '请选择操作类型'
                }
              ]
            }
            )(<XtSelect data={[{ key: '1', val: '上线' }, { key: '2', val: '下线' }]} style={{ width: '174px' }} placeholder="请输入" />)}
          </Form.Item>
          <Form.Item label="上传文件">
            {getFieldDecorator('trimFileUrl', {
              rules: [
                {
                  required: true,
                  message: '请上传文件'
                }
              ]})(
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
