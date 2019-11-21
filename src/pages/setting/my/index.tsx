import React from 'react'
import { Card, Row, Col } from 'antd'
import styles from './index.module.styl'
import Form, { FormItem } from '@/packages/common/components/form'
import { getFieldsConfig } from './config'
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
            <Form config={getFieldsConfig()}>
              <FormItem></FormItem>
            </Form>
          </Col>
        </Row>
      </Card>
    )
  }
}
export default Main