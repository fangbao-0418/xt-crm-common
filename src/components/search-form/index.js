import React, { PureComponent } from 'react';
import { Input, Select, DatePicker, Form, Button, Row, Col } from 'antd';
import { firstLetterToUpperCase, setQuery, parseQuery } from '@/util/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
// const dateFormat = 'YYYY-MM-DD HH:mm:ss';
@Form.create()
export default class extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      initParams: parseQuery()
    }
  }

  renderInput = (item) => {
    return (
      <Input />
    )
  }

  renderDate = (item) => {
    return (
      <RangePicker />
    )
  }

  renderSelect = (item) => {
    const { options } = item;
    return (
      <Select>
        {
          options.map(({ key, val }) => (<Option value={key} key={key}>{val}</Option>))
        }
      </Select>
    )
  }

  handleSearch = () => {
    const { form: { validateFields }, search, format } = this.props;

    validateFields((errors, values) => {
      if (!errors) {
        // const { customTime = [], ...other } = values;
        let data = values;
        if(format) data = format(data);
        // const payload = {
        //   ...other,
        //   startTime: customTime[0] && customTime[0].unix(),
        //   endTime: customTime[1] && customTime[1].unix(),
        // }
        setQuery(data);
        search(data);
      }
    });
  }

  resetFields = () => {
    const { form: { resetFields }, clear } = this.props;
    resetFields();
    clear();
  }

  render() {
    const { options = [], form: { getFieldDecorator }, className, children } = this.props;
    const { initParams } = this.state;
    return (
      <Form {...{
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        }
      }} className={"i-search-form" + (className ? " " + className : "")}>
        <Row>
          {
            options.map((item,i) => {
              const { type = '', id = '', label = '', config = {} } = item;
              const renderFun = this[`render${firstLetterToUpperCase(type)}`];
              return (
                <Col span={6} key={i}>
                  <FormItem label={label} key={item.id}>
                    {
                      getFieldDecorator(id, {
                        initialValue: initParams[id] || '',
                        ...config
                      })(
                        renderFun && renderFun(item)
                      )
                    }
                  </FormItem>
                </Col>
              )
            })
          }
          <Col span={6} style={{float:'right'}}>
            <FormItem className='i-search-btns'>
              <Button onClick={this.resetFields}>重置</Button>
              <Button type="primary" onClick={this.handleSearch}>查询</Button>
              {children}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}