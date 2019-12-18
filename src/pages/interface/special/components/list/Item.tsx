import React from 'react'
import { Row, Col } from 'antd'
import styles from './style.module.styl'
import { ColProps } from 'antd/es/col'

interface Props {
  label?: string | number | React.ReactNode,
  labelAlign?: 'left' | 'right',
  labelCol?: ColProps
  wrapperCol?: ColProps
}

class Item extends React.Component<Props, any> {
  public static defaultProps = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
  public render () {
    const { labelAlign, label, labelCol, wrapperCol, children } = this.props
    return (
      <Row className={styles.item}>
        {label && (
          <Col
            {...labelCol}
            style={{ textAlign: labelAlign }}
          >
            <label>{label}</label>
          </Col>
        )}
        <Col
          {...wrapperCol}
        >
          {children}
        </Col>
      </Row>
    )
  }
}

export default Item
