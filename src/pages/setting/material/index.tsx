import React from 'react'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { PageHeader, Radio, Checkbox, Button, message } from 'antd'
import { formItemLayout } from '@/config'
import * as api from './api'
import styles from './style.module.styl'

const CheckboxGroup = Checkbox.Group

// 开通的会员类型
const memberOptions = [
  { label: '非会员', value: 0 },
  { label: '团长', value: 10 },
  { label: '区长', value: 20 },
  { label: '合伙人', value: 30 },
  { label: '管理员', value: 40 }
]

class Main extends React.Component {
  public form: FormInstance

  public componentDidMount () {
    // 获取后台配置赋值form
    api.getMaterialSetting().then((res: any) => {
      this.form.props.form.setFieldsValue(res)
    })
  }

  /**
   * 保存当前素材配置
   *
   * @memberof Main
   */
  public saveSetting () {
    const form = this.form.props.form
    form.validateFields((err: any, vals: any) => {
      if (!err) {
        api.setMaterialSetting(vals).then(res => {
          if (res) {
            return message.success('保存成功')
          }
        })
      }
    })
  }
  public render () {
    return (
      <div>
        <PageHeader
          className={styles['site-page-header']}
          title='素材管理'
        />
        <div className={styles['main-box']}>
          <Form
            getInstance={(ref) => {
              this.form = ref
            }}
            addonAfter={(
            <>
              <FormItem {...formItemLayout}>
                <Button type='primary' onClick={() => this.saveSetting()}>
                  保存
                </Button>
              </FormItem>
            </>
            )}
          >
            <FormItem
              label='素材自动审核'
              inner={(form) => {
                return form.getFieldDecorator('auditType')(
                  <Radio.Group>
                    <Radio disabled value={1}>自动</Radio>
                    <Radio value={2}>手动</Radio>
                  </Radio.Group>
                )
              }}
            >
            </FormItem>
            <FormItem
              label='发布人限制'
              inner={(form) => {
                return form.getFieldDecorator('memberTypes')(
                  <CheckboxGroup
                    options={memberOptions}
                  />
                )
              }}
            >
            </FormItem>
            <FormItem
              label='启用口碑秀'
              inner={(form) => {
                return form.getFieldDecorator('status')(
                  <Radio.Group>
                    <Radio value={1}>开启</Radio>
                    <Radio value={2}>关闭</Radio>
                  </Radio.Group>
                )
              }}
            >
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
export default Main
