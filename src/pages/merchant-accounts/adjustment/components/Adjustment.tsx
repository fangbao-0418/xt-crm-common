/** 调整单 */
import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import Upload from '@/components/upload'
import { Button } from 'antd'

interface Props {
  readonly?: boolean
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public validateAccId () {

  }
  public render () {
    const readonly = this.props.readonly
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          formItemStyle={{
            marginBottom: 10
          }}
          getInstance={(ref) => { this.form = ref }}
          readonly={readonly}
          labelCol={{span: 5}}
          wrapperCol={{span: 18}}
        >
          <FormItem
            name='serialNo'
            type='input'
            label='对账单ID'
            verifiable
            controlProps={{
              style: { width: '100%' }
            }}
            wrapperCol={{span: 10}}
            addonAfterCol={{span: 6}}
            addonAfter={!readonly && (
              <Button
                className='ml10'
                onClick={this.validateAccId.bind(this)}
              >
                校验
              </Button>
            )}
          />
          <FormItem name='accName' verifiable />
          {/* <FormItem name='c' label='供应商' /> */}
          <FormItem name='trimType' verifiable />
          <FormItem name='trimReason' verifiable />
          <FormItem
            verifiable
            name='trimMoney'
            wrapperCol={{
              span: 6
            }}
            addonAfterCol={{
              span: 10
            }}
            addonAfter={(
              <span style={{fontSize: 12, color: '#999'}}>（仅支持精确到小数点2位）</span>
            )}
          />
          <FormItem name='trimExplain' verifiable />
          <FormItem
            label='调整文件'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('trimFileUrl')(
                    <Upload
                      disabled={readonly}
                      listType='text'
                      // maxCount={3}
                      listNum={3}
                      // fileType={['spreadsheetml', 'wordprocessingml']}
                      // fileTypeText='请上传正确doc、xls格式文件'
                    >
                      <span className='href'>+添加文件</span>
                    </Upload>
                  )}
                  <div style={{fontSize: 12, color: '#999'}}>支持xls、word格式，最多可上传3个文件，最大支持10MB</div>
                </div>
              )
            }}
          />
          <FormItem
            label='图片凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('trimImgUrl')(
                    <Upload
                      disabled={readonly}
                      listType='picture-card'
                      // maxCount={5}
                      listNum={5}
                      multiple
                      // size={2}
                    >
                    </Upload>
                  )}
                  <div style={{fontSize: 12, color: '#999'}}>- 支持png、jipg、jpeg格式，最多可上传5张图片，最大支持2MB</div>
                  <div style={{fontSize: 12, color: '#999'}}>- 添加文件和图片凭证，可提高审核效率哦～</div>
                </div>
              )
            }}
          />
        </Form>
      </div>
    )
  }
}
export default Main
