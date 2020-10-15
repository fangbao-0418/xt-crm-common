import React from 'react'
import { Form, FormItem, SelectFetch } from '@/packages/common/components'
import { defaultFormConfig } from './config'
import { Button, Card, Input, InputNumber, Switch } from 'antd'
import UploadView from '@/components/upload'
import BraftEditor from 'braft-editor'
import GoodsModal from './GoodsModal'
import 'braft-editor/dist/index.css'
import { getAllColumn } from './api'

class Main extends React.Component {
  public modalRef: React.RefObject<GoodsModal> = React.createRef<GoodsModal>()
  public render () {
    return (
      <Card>
        <GoodsModal ref={this.modalRef} />
        <Form config={defaultFormConfig}>
        <FormItem
          required
          label='栏目'
          inner={(form) => {
            return form.getFieldDecorator('columnId', {
              rules: [{
                required: true,
                message: '请选择栏目'
              }]
            })(
              <SelectFetch
                fetchData={getAllColumn}
                style={{ width: 196 }}
              />
            )
          }}
        />
          <FormItem name='memberLimit' />
          <FormItem
            name='title'
            label='标题'
            verifiable
            controlProps={{
              style: {
                width: 400
              },
              maxLength: 20
            }}
            placeholder='在这里输入标题，不超过20字'
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '在这里输入标题，不超过20字'
              }]
            }}
          />
          <FormItem
            label='支持分享'
            inner={(form) => {
              return form.getFieldDecorator('shareStatus')(
                <Switch
                  checkedChildren='开'
                  unCheckedChildren='关'
                />
              )
            }}
          />
          <FormItem
            required
            label='图片/视频'
            inner={(form) => {
              return (
                <div>
                  <div style={{ display: 'flex', width: '250px' }}>
                    <UploadView
                      ossType='cos'
                      placeholder='上传首图'
                      listType='picture-card'
                      listNum={1}
                      size={0.3}
                    />
                    <UploadView
                      ossType='cos'
                      placeholder='上传视频/音频'
                      listType='picture-card'
                      listNum={1}
                      size={0.3}
                    />
                  </div>
                  <div>图片格式要求：png、jpeg、gif 尺寸建议：320px*180px，视频/音频上传，支持mkv、mp4、avi、mp3，（音视频发布有一定转码时间</div>
                </div>
              )
            }}
          />
          <FormItem label='正文内容' name='contextType' />
          <FormItem
            style={{ margin: 0 }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            inner={(form) => {
              const contextType = form.getFieldValue('contextType')
              return contextType === '1' ? (
                <FormItem
                  required
                  label='富文本'
                  inner={(form) => {
                    return form.getFieldDecorator('context', {
                      rules: [{
                        required: true,
                        message: '请输入正文'
                      }]
                    })(
                      <BraftEditor
                        style={{ border: '1px solid #d9d9d9'}}
                        placeholder='在这里输入正文'
                      />
                    )
                  }}
                />
              ): (
                <FormItem
                  label='链接'
                  inner={(form) => {
                    return form.getFieldDecorator('context', {
                      rules: [{
                        required: true,
                        message: '请输入链接'
                      }]
                    })(
                      <Input placeholder='在这里输入url' />
                    )
                  }}
                />
              )
            }}
          />
          <FormItem name='releaseTime' />
          <FormItem label='添加商品'>
            <span className='href' onClick={this.modalRef.current?.open}>选择商品</span>
          </FormItem>
          <FormItem name='virtualRead' />
          <FormItem>
            <Button type='primary'>提交</Button>
            <Button className='ml10'>保存草稿</Button>
            <Button className='ml10'>取消</Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Main