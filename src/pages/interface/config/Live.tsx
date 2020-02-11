import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import { getFieldsConfig } from './config'
import UploadView from '@/components/upload'

interface State {
  /** 直播频道展示类型 1-不展示 2-使用默认配置 3-自定义配置 */
  type: 1 | 2 | 3
}

class Main extends React.Component<{}, State> {
  public form: FormInstance
  public state: State = {
    type: 1
  }
  public render () {
    const { type } = this.state
    return (
      <div>
        <Form
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          config={getFieldsConfig()}
          namespace='live'
          getInstance={(ref) => {
            this.form = ref
          }}
          onChange={(field, value, values) => {
            if (values) {
              this.setState({
                type: values.liveStyle
              })
            }
          }}
          silent={false}
        >
          <FormItem
            name='liveStyle'
            required
          />
          <If visible condition={type === 3}>
            <FormItem
              label='直播背景图1'
              required
              inner={(form) => {
                return (
                  <>
                    <div>
                      {form.getFieldDecorator(
                        'liveBackgroudImg1',
                        {
                          rules: [
                            {
                              validator: (rule, value, cb) => {
                                console.log(value)
                                if (!value) {
                                  cb('直播背景图1不能为空')
                                }
                                cb()
                              }
                            }
                          ]
                        }
                      )(
                        <UploadView
                          listType='picture-card'
                        />
                      )}
                    </div>
                    <div
                      style={{color: 'rgba(0, 0, 0, 0.65)'}}
                    >
                      多直播状态，图片格式支持png,jpg，规格为：待补充；750X380
                    </div>
                  </>
                )
              }}
            />
            <FormItem
              label='直播背景图2'
              required
              inner={(form) => {
                return (
                  <>
                    <div>
                      {form.getFieldDecorator(
                        'liveBackgroudImg2',
                        {
                          rules: [
                            {
                              validator: (rule, value, cb) => {
                                console.log(value)
                                if (!value) {
                                  cb('直播背景图2不能为空')
                                }
                                cb()
                              }
                            }
                          ]
                        }
                      )(
                        <UploadView
                          listType='picture-card'
                        />
                      )}
                    </div>
                    <div
                      style={{color: 'rgba(0, 0, 0, 0.65)'}}
                    >
                      单直播状态，图片格式支持png,jpg，规格为：750X420
                    </div>
                  </>
                )
              }}
            />
            <FormItem
              label='直播logo'
              required
              inner={(form) => {
                return (
                  <>
                    <div>
                      {form.getFieldDecorator(
                        'liveLogo',
                        {
                          rules: [
                            {
                              validator: (rule, value, cb) => {
                                if (!value) {
                                  cb('直播logo不能为空')
                                }
                                cb()
                              }
                            }
                          ]
                        }
                      )(
                        <UploadView
                          listType='picture-card'
                        />
                      )}
                    </div>
                    <div
                      style={{color: 'rgba(0, 0, 0, 0.65)'}}
                    >
                      图片格式支持png,jpg，规格为：54X54
                    </div>
                  </>
                )
              }}
            />
            <FormItem
              label='更多直播icon'
              required
              inner={(form) => {
                return (
                  <>
                    <div>
                      {form.getFieldDecorator(
                        'liveMoreIcon',
                        {
                          rules: [
                            {
                              validator: (rule, value, cb) => {
                                if (!value) {
                                  cb('更多直播icon不能为空')
                                }
                                cb()
                              }
                            }
                          ]
                        }
                      )(
                        <UploadView
                          listType='picture-card'
                        />
                      )}
                    </div>
                    <div
                      style={{color: 'rgba(0, 0, 0, 0.65)'}}
                    >
                      图片格式支持png,jpg，规格为：48X48
                    </div>
                  </>
                )
              }}
            />
            <FormItem
              name='liveTitleColor'
              verifiable
            />
            <FormItem
              name='liveTitle'
              verifiable
            />
            <FormItem
              name='liveSubTitleColor'
              verifiable
            />
            <FormItem
              name='liveSubTitle'
              // verifiable
            />
          </If>
        </Form>
      </div>
    )
  }
}
export default Main
