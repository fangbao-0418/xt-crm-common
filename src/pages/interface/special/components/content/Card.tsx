import React from 'react'
import { Card, Row, Col, Icon, Radio } from 'antd'
import Shop from './shop'
import Upload from '@/components/upload'
import Draggable from '@/components/draggable'
import styles from './style.module.sass'
interface Props {
  title: string,
  type: 'shop' | 'ad'
}
class Main extends React.Component<Props> {
  public renderShop (): React.ReactNode {
    return (
      <div>
        <Row gutter={12}>
          <Col span={3}>
            样式: 
          </Col>
          <Col span={9}>
            <Radio.Group>
              <Radio value={1}>1*1</Radio>
              <Radio value={2}>1*2</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={3}></Col>
          <Col span={9}>
            <Shop />
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={3}></Col>
          <Col span={9}>
            <span className="href">添加商品</span>
          </Col>
        </Row>
      </div>
    )
  }
  public renderAd (): React.ReactNode {
    return (
      <Draggable
        className={styles['shop-draggable']}
        dragElement=".ant-upload-list-item"
      >
        <Upload
          value={[
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
              uid: '-2',
              name: 'image.png',
              status: 'done',
              url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551566031477231.jpg?x-oss-process=style/p_450',
            },
            {
              uid: '-3',
              name: 'image.png',
              status: 'done',
              url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551566379883466.jpg?x-oss-process=style/p_150',
            },
            {
              uid: '-4',
              name: 'image.png',
              status: 'done',
              url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551566812721849.jpg?x-oss-process=style/p_450',
            },
            {
              uid: '-5',
              name: 'image.png',
              status: 'done',
              url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551566383800137.jpg?x-oss-process=style/p_150',
            },
            {
              uid: '-6',
              name: 'image.png',
              status: 'done',
              url: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551566390062816.jpg?x-oss-process=style/p_150',
            },
          ]}
          listNum={10}
          listType="picture-card"
        />
      </Draggable>
    )
  }
  public renderLayout (): React.ReactNode {
    const { type } = this.props
    switch (type) {
      case 'ad':
        return this.renderAd()
      case 'shop':
        return this.renderShop()
    }
  }
  public render () {
    return (
      <Card
        size="small"
        title={this.props.title}
        extra={(<Icon type="delete" />)}
      >
        {this.renderLayout()}
      </Card>
    )
  }
}
export default Main