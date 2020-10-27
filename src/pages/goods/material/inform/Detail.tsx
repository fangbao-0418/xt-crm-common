import React from 'react'
import Form, { FormItem } from '@/packages/common/components/form'
import { getFieldsConfig } from './config'
import Image from '@/components/Image'
import { Radio, Button } from 'antd'

import styles from './style.module.styl'

function ReportInfo () {
  return (
    <div className={styles['report-info']}>
    <div className='clear'>
      <div className={styles['report-info-avatar']}>
        <img src="https://axure-file.lanhuapp.com/6c74a568-2a43-4303-b380-de2eec294975__fa7fbc5e52acdd3bf00154b895030727.svg" />
      </div>
      <div className={styles['report-info-info']}>
        <div>亚琼</div>
        <div>2020-04-28 18:12:13</div>
      </div>
    </div>
     <div>
     可谓是心心念念了好久，终于今天，在下不才
 我终于买到手了！
这个蛋糕🍰的吃法搭配特仑苏
     </div>
     </div>
  )
}

class Main extends React.Component {
  public render () {
    return (
      <div className={styles.detail}>
        <Form
          config={getFieldsConfig()}
        >
          <FormItem name='type' />
          <FormItem name='description' />
          <FormItem label='图片证据'>
            <Image src="" />
          </FormItem>
          <FormItem label='举报评论'>
            <div style={{ marginTop: 10 }}>
              <ReportInfo />
            </div>
          </FormItem>
          <FormItem label='相关商品名称'>
            <Image src="" />
          </FormItem>
          <FormItem label='举报结果'>
            <Radio.Group defaultValue="1" buttonStyle="solid">
              <Radio.Button value="1">举报属实</Radio.Button>
              <Radio.Button value="2">无效举报</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem name='feedbackWord' />
          <FormItem>
            <Button type='primary' className='mr10'>
              提交
            </Button>
            <Button type='primary'>
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Main