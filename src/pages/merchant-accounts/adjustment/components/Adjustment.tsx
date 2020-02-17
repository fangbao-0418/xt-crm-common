/** 调整单 */
import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import { getFieldsConfig } from '../config'
import Upload from '@/components/upload'
import { Button } from 'antd'
import * as api from '../api'

interface Props {
  readonly?: boolean
  from?: 'checking' | 'self'
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public validateAccId () {
    const values = this.form.getValues()
    const id = values.accNo
    if (!id) {
      APP.error('请输入对账单ID')
      return
    }
    api.validateAccNo(id).then((res) => {
      APP.success('校验通过')
      this.form.setValues({
        accName: res.accName
      })
    })
  }
  public render () {
    const readonly = this.props.readonly || false
    const from = this.props.from || 'self'
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
            name='accNo'
            type='input'
            readonly={readonly || from === 'checking'}
            label='对账单ID'
            verifiable
            controlProps={{
              style: { width: '100%' }
            }}
            wrapperCol={{
              span: readonly ? 19 : 10
            }}
            addonAfterCol={{span: 6}}
            addonAfter={(!readonly && from === 'self') && (
              <Button
                className='ml10'
                onClick={this.validateAccId.bind(this)}
              >
                校验
              </Button>
            )}
          />
          <FormItem
            name='accName'
            verifiable
            readonly={readonly || from === 'checking'}
          />
          <If condition={readonly}>
            <FormItem name='storeName' label='供应商' />
          </If>
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
            addonAfter={!readonly && (
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
                      accept='doc,xls'
                      size={10}
                      // fileType={['spreadsheetml', 'wordprocessingml']}
                      fileTypeErrorText='请上传正确doc、xls格式文件'
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
                      // fileType={['jpg', 'png', 'jpeg']}
                      listNum={5}
                      multiple
                      size={2}
                    >
                    </Upload>
                  )}
                  <div style={{fontSize: 12, color: '#999'}}>- 支持png、jpg、jpeg格式，最多可上传5张图片，最大支持2MB</div>
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
