/** 调整单 */
import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../config'
import Upload from '@/components/upload'
class Main extends React.Component {
  public render () {
    return (
      <div>
        <Form
          config={getFieldsConfig()}
        >
          <FormItem name='a' type='input' label='对账单ID' />
          <FormItem name='b' />
          <FormItem name='c' />
          <FormItem name='e' />
          <FormItem
            name='a5'
            wrapperCol={{
              span: 6
            }}
            addonAfterCol={{
              span: 14
            }}
            addonAfter={(
              <span>（仅支持精确到小数点2位）</span>
            )}
          />
          <FormItem name='a6' />
          <FormItem
            label='调整文件'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('a7')(
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
            label='图片凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('a8')(
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
