import React from 'react'
import { Card, Row, Col, Checkbox, Button } from 'antd'
import styles from './index.module.styl'
import Form, { FormItem } from '@/packages/common/components/form'
import Upload from '@/components/upload'
interface options {
  label: string;
  value: number;
}
const portsOptions: options[] = [
  { label: 'Android', value: 1 },
  { label: 'iOS', value: 2 },
  { label: 'H5', value: 3 },
  { label: '小程序', value: 4 }
]
const memberTypesOptions: options[] = [
  { label: '未登录用户', value: -1 },
  { label: '普通会员', value: 0 },
  { label: '团长', value: 10 },
  { label: '区长', value: 20 },
  { label: '合伙人', value: 30 }
]
class Main extends React.Component {
  public constructor (props: any) {
    super(props)
  }
  public render () {
    return (
      <Card>
        <Row className={styles.row}>
          <Col span={12} className={styles.col}>
            <h2 className={styles.title}>个人中心配置</h2>
          </Col>
          <Col span={12} className={styles.col}>
            <h2 className={styles.title}>icon配置</h2>
            <Form>
              <FormItem
                name='iconName'
                type='input'
                label='icon名称'
                verifiable={true}
                fieldDecoratorOptions={{
                  rules: [{
                    required: true
                  }]
                }}
              />
              <FormItem
                label='上传图片'
                verifiable={true}
                fieldDecoratorOptions={{
                  rules: [{
                    required: true
                  }]
                }}
                inner={(form) => {
                  return form.getFieldDecorator('iconUrl')(
                    <Upload
                      listType='picture-card'
                      placeholder='上传'
                      showUploadList={false}
                    />
                  )
                }}
              />
              <FormItem
                name='iconName'
                type='input'
                label='排序'
                verifiable={true}
                controlProps={{
                  placeholder: '排序越大越靠前'
                }}
                fieldDecoratorOptions={{
                  rules: [{
                    required: true
                  }]
                }}
              />
              <FormItem
                name='url'
                type='input'
                label='地址'
                verifiable={true}
                controlProps={{
                  placeholder: '请输入内容'
                }}
                fieldDecoratorOptions={{
                  rules: [{
                    required: true
                  }]
                }}
              />
              <FormItem
                label='显示端口'
                inner={(form) => {
                  return form.getFieldDecorator('ports')(
                    <Checkbox.Group
                      options={portsOptions}
                    />
                  )
                }}
              />
              <FormItem
                label='显示用户'
                inner={(form) => {
                  return form.getFieldDecorator('memberTypes')(
                    <Checkbox.Group
                      options={memberTypesOptions}
                    />
                  )
                }}
              />
              <FormItem
                inner={(form) => {
                  return (
                    <>
                      <Button type='primary'>保存</Button>
                      <Button type='danger' className='ml10'>删除</Button>
                    </>
                  )
                }}
              />
            </Form>
          </Col>
        </Row>
      </Card>
    )
  }
}
export default Main