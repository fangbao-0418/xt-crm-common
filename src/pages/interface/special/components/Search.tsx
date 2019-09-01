import React from 'react'
import { Form, Input, Button } from 'antd'
import classNames from 'classnames'
import { FormComponentProps } from 'antd/lib/form'
import styles from './style.module.sass'
interface Props extends FormComponentProps {
  className?: string
}

class Main extends React.Component<Props> {
  public render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div className={classNames(styles.search, this.props.className)}>
        <Form layout="inline">
          <Form.Item
            label='专题ID'
          >
            {
              getFieldDecorator('a', {})(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item
            label='专题名称'
          >
            {
              getFieldDecorator('a', {})(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item
            label='状态'
          >
            {
              getFieldDecorator('a', {})(
                <Input />
              )
            }
          </Form.Item>
          <Form.Item>
            <Button
              style={{marginRight: 10}}
              type="primary"
            >
              查询
            </Button>
            <Button>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default Form.create<Props>()(Main)