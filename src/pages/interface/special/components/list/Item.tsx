import React from 'react'
import { Row, Col, message } from 'antd'
import styles from './style.module.styl'
import classnames from 'classnames'
import { ColProps } from 'antd/es/col'

interface Props {
  label?: string | number | React.ReactNode,
  labelAlign?: 'left' | 'right',
  labelCol?: ColProps
  wrapperCol?: ColProps
  required?: boolean
}

class Item extends React.Component<Props, any> {
  public static defaultProps = {
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
  public render () {
    const { labelAlign, label, labelCol, wrapperCol, children, required } = this.props
    const errorMsg = ''
    return (
      <Row className={styles['item']}>
        {label && (
          <Col
            {...labelCol}
            style={{ textAlign: labelAlign }}
          >
            <label className={required ? styles['required'] : ''}>{label}</label>
          </Col>
        )}
        <Col
          {...wrapperCol}
          className={classnames(styles['item-control'])}
        >
          <Row className={styles['item-with-help']}>
            <span>{children}</span>
          <div className={styles['item-explain']}>{errorMsg}</div>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default Item
