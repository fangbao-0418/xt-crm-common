/** 结算单 */
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
          namespace='statements'
          formItemStyle={{
            marginBottom: 10
          }}
        >
          <FormItem name='accId' type='input' label='对账单ID' />
          <FormItem name='currency' />
          <FormItem name='accountType0' />
          <FormItem name='accountType' />
          <FormItem name='accountName' />
          <FormItem name='accountCode' />
          <FormItem name='bankName' />
          <FormItem
            label='发票凭证'
            inner={(form) => {
              return (
                <div>
                  {form.getFieldDecorator('a8')(
                    <Upload
                      listType='picture-card'
                      multiple
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
