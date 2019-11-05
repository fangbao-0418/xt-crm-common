import React from 'react'
import { Card, Row, Col, Form } from 'antd'
import { FormComponentProps } from 'antd/es/form';
import { ConfigItem } from './interface'
import FormItem from '@/packages/common/components/form/FormItem';
interface Props extends FormComponentProps<any> {
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
    console.log()
    return (
      <div>
        <Form {...formProps}>
          <Card title="筛选" extra={<a href="#">More</a>}>
            <Row gutter={layout.gutter}>
              {
                dataSource.map((config: ConfigItem) => {
                  return (
                    <Col span={layout.span}>
                      <FormItem
                        name={config.name}
                        label={config.label}
                        type={config.type}
                      />
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
export default Main;