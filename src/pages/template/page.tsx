import React from 'react';
import { listColumns } from './contant';
import { withRouter, RouteComponentProps } from 'react-router';
import { Card, Form, Input, DatePicker, Button, Table } from 'antd';
const { RangePicker } = DatePicker;
class Page extends React.Component<RouteComponentProps, {}> {
  render() {
    return (
      <Card>
        <Card title="筛选">
          <Form layout="inline">
            <Form.Item label="模板名称">
              <Input />
            </Form.Item>
            <Form.Item label="操作时间">
              <RangePicker />
            </Form.Item>
            <Form.Item label="创建时间">
              <RangePicker />
            </Form.Item>
            <Button type="primary" onClick={() => {this.props.history.push('/template/edit')}}>新增模板</Button>
            <Button className="ml10">清除</Button>
            <Button className="ml10" type="primary">查询</Button>
          </Form>
        </Card>
        <Card>
          <Table columns={listColumns}>


          </Table>
        </Card>
      </Card>
    );
  }
}

export default withRouter(Page);