import * as React from 'react';
import { Modal, Input, Row, Button } from 'antd';
import { batchExport } from '../../api';
import ExpressCompanySelect from '@/components/express-company-select';
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
const TextArea = Input.TextArea
interface LogisticsTrackProps {
  visible?: boolean;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

/** 物流轨迹弹窗 */
class LogisticsTrack extends React.Component<LogisticsTrackProps> {
  // 导出
  handleBatchExport = () => {
    this.form && this.form.props.form.validateFields((err, vals) => {
      if (!err) {
        batchExport(vals)
      }
    })
  }
  form: FormInstance;
  render() {
    return (
      <Modal
        title='按快递单号批量查询物流轨迹'
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        footer={(
          <Button
            type='primary'
            onClick={this.handleBatchExport}
          >
            导出
          </Button>
        )}
      >
        <Form getInstance={ref => this.form = ref}>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label='快递公司选择'
            required
            inner={(form) => {
              return form.getFieldDecorator('expressCompanyCode', {
                rules: [{
                  required: true,
                  message: '请选择快递公司'
                }]
              })(
                <ExpressCompanySelect allowClear />
              )
            }}
          />
          <FormItem
            name='expressNumbers'
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            type='textarea'
            placeholder='请输入快递单号，以换行区分，目前支持圆通、申通、中通、百世的单号查询，单次只能查询一家快递公司的快递单号'
            controlProps={{ rows: 14 }}
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '请输入快递单号'
              }]
            }}
          />
        </Form>
      </Modal>
    )
  }
}

export default LogisticsTrack;