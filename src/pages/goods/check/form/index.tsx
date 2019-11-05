import React from 'react'
import { Card, Row, Col, Form } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { ConfigItem } from './interface'
// import {}
interface Props extends FormComponentProps {
  dataSource: any
  formProps?: any,
  placeholder?: string
  layout?: any
}
interface State {

}

class Main extends React.Component<Props, State>{
  public static defaultProps = {
    formProps: {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        sm: { span: 16 },
      }
    },
    layout: {
      span: 8,
      gutter: 24
    }
  }
  public render() {
    const { dataSource, formProps, layout, form: { getFieldDecorator } } = this.props
    return (
      <div>
        <Form {...formProps}>
          <Card title="筛选" extra={<a href="#">More</a>}>
            <Row gutter={layout.gutter}>
              {
                dataSource.map((config: ConfigItem) => {
                  const placeholder = this.props.placeholder || `请输入${config.label}`
                  return (
                    <Col span={layout.span}>
                      <FormItem label={config.label}>
                        {getFieldDecorator(config.name)(<Input placeholder={placeholder} />)}
                      </FormItem>
                    </Col>
                  )
                })
              }
            </Row>
          </Card>
        </Form>
      </div>
    )
  }
}
export default Form.create<Props>({ name: 'check-search-form' })(Main);