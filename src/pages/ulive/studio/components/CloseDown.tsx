import React from 'react'
import { Input, Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import * as api from '../api'
const TextArea = Input.TextArea
interface Props {
  detail: UliveStudio.ItemProps
  hide?: () => void
  refresh?: () => void
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public hide = () => {
    if (this.props.hide) {
      this.props.hide()
    }
  }
  public onOk = () => {
    this.form.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      console.log(value)
      const detail = this.props.detail
      api.stopPlay({
        planId: detail.planId,
        breakReason: value.breakReason,
        isBlock: value.isBlock ? value.isBlock[0] : 0
      }).then(() => {
        this.hide()
        this.refresh()
      })
    })
  }
  public refresh () {
    if (this.props.refresh) {
      this.props.refresh()
    }
  }
  public render () {
    return (
      <div>
        <div className='mb10' style={{fontSize: 16, fontWeight: 'bold'}}>强行停播将影响主播正常播出流程！</div>
        <div>仅建议在直播间涉嫌违规的情况下使用</div>
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          <div className='mt10'>
            <FormItem
              labelCol={{span: 0}}
              name='breakReason'
              placeholder='请填写该主播违规原因'
              type='textarea'
              style={{marginBottom: 0}}
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  {
                    required: true,
                    message: '请填写该主播违规原因'
                  },
                  {
                    max: 50,
                    message: '违规原因限50个字'
                  }
                ]
              }}
            />
          </div>
          <div className='text-center'>
            <FormItem
              labelCol={{span: 0}}
              wrapperCol={{span: 24}}
              name='isBlock'
              type='checkbox'
              style={{marginBottom: 0}}
              fieldDecoratorOptions={{
                initialValue: [1]
              }}
              options={[
                {label: '同时拉黑该主播', value: 1}
              ]}
            />
          </div>
        </Form>
        <div className='text-center'>
          <Button onClick={this.onOk} type='primary' className='mr10'>确认</Button>
          <Button onClick={this.hide}>取消</Button>
        </div>
      </div>
    )
  }
}
export default Main
