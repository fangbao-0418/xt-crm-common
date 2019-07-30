import React, { Component } from 'react';
import { Card, Row, Col, Form, DatePicker, Button, Spin } from 'antd';
import { connect } from '@/util/utils';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect()
@Form.create()
export default class extends Component {

  state = {
    loading: false
  };

  exportFile = () => {
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((errors, values) => {
      const { time } = values;
      const payload = {
        payStartTime: time && time[0] && time[0].format(timeFormat),
        payEndTime : time && time[1] && time[1].format(timeFormat),
        time: undefined, // 覆盖values.time
      };
      this.setState({
        loading: true
      })
      dispatch['finance.order'].exportFile(payload).finally(() =>{
        this.setState({
          loading: false
        })
      })
    })
  }
  renderForm = () => {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form layout="inline">
        <FormItem label="支付时间">
          {
            getFieldDecorator('time')(
              <RangePicker
                showTime
              />
            )
          }
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={() => this.exportFile()}>导出</Button>
        </FormItem>
      </Form>
    )
  }

  render() {
    return (
      <Spin tip="操作处理中..." spinning={this.state.loading}>
        <Card>
          <Row>
            <Col style={{ marginBottom: 20 }}>
              {this.renderForm()}
            </Col>
          </Row>
        </Card>
      </Spin>
    );
  }
}