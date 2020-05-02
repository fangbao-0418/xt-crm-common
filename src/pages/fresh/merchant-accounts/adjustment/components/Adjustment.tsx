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
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public validateSupplierId () {
    const values = this.form.getValues()
    const id = values.supplierId
    if (!id) {
      APP.error('请输入供应商ID')
      return
    }
    api.fetchStoreList(id).then((res) => {
      APP.success('校验通过')
      console.log(res, 'res')
      this.form.setValues({
        supplierName: res.name
      })
    }, () => {
      APP.error('该供应商ID不存在')
    })
  }
  public render () {
    const readonly = this.props.readonly || false
    return (
      <div>
        <Form
          config={getFieldsConfig.call(this)}
          formItemStyle={{
            marginBottom: 10
          }}
          getInstance={(ref) => {
            this.form = ref
          }}
          readonly={readonly}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
        >
          <FormItem
            name='supplierId'
            type='input'
            readonly={readonly}
            verifiable
            controlProps={{
              style: { width: '100%' }
            }}
            wrapperCol={{
              span: readonly ? 19 : 10
            }}
            addonAfterCol={{ span: 6 }}
            addonAfter={(!readonly) && (
              <Button
                className='ml10'
                onClick={this.validateSupplierId.bind(this)}
              >
                校验
              </Button>
            )}
          />
          <If condition={!readonly}>
            <FormItem
              name='supplierNameSelect'
              verifiable
              readonly={readonly}
            />
          </If>
          <If condition={readonly}>
            <FormItem readonly={readonly} name='supplierName' label='供应商' />
          </If>
          <FormItem name='billType' verifiable />
          <FormItem name='trimReason' verifiable />
          <FormItem
            verifiable
            name='billMoney'
            fieldDecoratorOptions={{
              rules: [
                { required: true, message: '调整金额不能为空' }
              ]
            }}
            wrapperCol={{
              span: 6
            }}
            addonAfterCol={{
              span: 10
            }}
            addonAfter={!readonly && (
              <span style={{ fontSize: 12, color: '#999' }}>（仅支持精确到小数点2位）</span>
            )}
          />
          <FormItem name='trimExplain' verifiable />
          <FormItem
            label='调整文件'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('fileVoucher')(
                    <Upload
                      multiple
                      disabled={readonly}
                      listType='text'
                      listNum={3}
                      accept='doc,xls'
                      size={10}
                      extname='doc,docx,xls,xlsx'
                      fileTypeErrorText='请上传正确doc、xls格式文件'
                    >
                      <span className={readonly ? 'disabled' : 'href'}>+添加文件</span>
                    </Upload>
                  )}
                  <div style={{ fontSize: 12, color: '#999' }}>支持xls、doc格式，最多可上传3个文件，最大支持10MB</div>
                </div>
              )
            }}
          />
          <FormItem
            label='图片凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('imgVoucher')(
                    <Upload
                      disabled={readonly}
                      listType='picture-card'
                      extname='png,jpg,jpeg'
                      listNum={5}
                      multiple
                      size={2}
                    >
                    </Upload>
                  )}
                  <div style={{ fontSize: 12, color: '#999' }}>- 支持png、jpg、jpeg格式，最多可上传5张图片，最大支持2MB</div>
                  <div style={{ fontSize: 12, color: '#999' }}>- 添加文件和图片凭证，可提高审核效率哦～</div>
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
