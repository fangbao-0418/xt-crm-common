/** 调整单 */
import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import Upload from '@/components/upload'
class Main extends React.Component {
  public form: FormInstance
  public render () {
    return (
      <div>
        <Form
          config={getFieldsConfig()}
          getInstance={(ref) => {
            this.form = ref
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
                      fileType={['spreadsheetml', 'wordprocessingml']}
                      fileTypeText='请上传正确doc、xls格式文件'
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
            label='文件凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('trimImgUrl')(
                     <Upload
                      listType='picture-card'
                      listNum={5}
                      multiple
                      size={2}
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
