/** 调整单 */
import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import Upload from '@/components/upload'
import If from '@/packages/common/components/if'
interface Props {
  readonly?: boolean
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public render () {
    const readonly = this.props.readonly || false
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          getInstance={(ref) => {
            this.form = ref
          }}
          readonly={readonly}
          formItemStyle={{
            marginBottom: 0
          }}
        >
          <FormItem name='auditOpinion' />
          <FormItem name='auditRemark' />
          <FormItem
            label='文件凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('fileVoucher')(
                    <Upload
                      listType='text'
                      listNum={3}
                      fileTypeErrorText='请上传正确doc、xls格式文件'
                      disabled={readonly}
                      size={10}
                      extname='doc,docx,xls,xlsx'
                    >
                      <span
                        className={readonly ? 'disabled' : 'href'}
                      >
                        +添加文件
                      </span>
                    </Upload>
                  )}
                  <div style={{ fontSize: 12, color: '#999' }}>支持xls、doc格式，最多可上传3个文件，最大支持10MB</div>
                </div>
              )
            }}
          />
          <FormItem
            label='文件凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('imgVoucher')(
                    <Upload
                      listType='picture-card'
                      listNum={5}
                      // fileType={['jpg', 'png', 'jpeg']}
                      extname='png,jpg,jpeg'
                      multiple
                      size={2}
                      disabled={readonly}
                    >
                    </Upload>
                  )}
                  <div style={{ fontSize: 12, color: '#999' }}>- 支持png、jpg、jpeg格式，最多可上传5张图片，最大支持2MB</div>
                  <div style={{ fontSize: 12, color: '#999' }}>- 添加文件和图片凭证，可提高审核效率哦～</div>
                </div>
              )
            }}
          />
          <If
            condition={readonly}
          >
            <FormItem
              name='auditName'
              label='审核人'
            />
            <FormItem
              name='verifyTime'
              label='审核时间'
            />
          </If>
        </Form>
      </div>
    )
  }
}
export default Main
