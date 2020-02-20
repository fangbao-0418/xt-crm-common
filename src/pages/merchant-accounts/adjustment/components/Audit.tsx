/** 调整单 */
import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import Upload from '@/components/upload'
import If from '@/packages/common/components/if'
interface Props {
  readonly?: boolean
  /** 财务|采购 */
  type: 'finance' | 'purchase'
}

class Main extends React.Component<Props> {
  public form: FormInstance
  public render () {
    const readonly = this.props.readonly || false
    const type = this.props.type
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
          <FormItem name='reviewStatus' />
          <FormItem name='trimExplain' label='审核说明' />
          <FormItem
            label='文件凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('trimFileUrl')(
                     <Upload
                      listType='text'
                      listNum={3}
                      fileTypeErrorText='请上传正确doc、xls格式文件'
                      disabled={readonly}
                      size={10}
                     >
                      <span className='href'>+添加文件</span>
                    </Upload>
                  )}
                  <div style={{fontSize: 12, color: '#999'}}>支持xls、doc格式，最多可上传3个文件，最大支持10MB</div>
                </div>
              )
            }}
          />
          <FormItem
            label='文件凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('trimImgUrl')(
                     <Upload
                      listType='picture-card'
                      listNum={5}
                      // fileType={['jpg', 'png', 'jpeg']}
                      multiple
                      size={2}
                      disabled={readonly}
                     >
                    </Upload>
                  )}
                  <div style={{fontSize: 12, color: '#999'}}>- 支持png、jpg、jpeg格式，最多可上传5张图片，最大支持2MB</div>
                  <div style={{fontSize: 12, color: '#999'}}>- 添加文件和图片凭证，可提高审核效率哦～</div>
                </div>
              )
            }}
          />
          <If
            condition={readonly}
          >
            <If condition={type === 'purchase'}>
              <FormItem
                name='purchaseReviewName'
                label='审核人'
              />
              <FormItem
                name='purchaseReviewTime'
                label='审核时间'
              />
            </If>
            <If
              condition={type === 'finance'}
            >
              <FormItem
                name='financeReviewName'
                label='审核人'
              />
              <FormItem
                name='financeReviewTime'
                label='审核时间'
              />
            </If>
          </If>
        </Form>
      </div>
    )
  }
}
export default Main
