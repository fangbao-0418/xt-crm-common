import React from 'react';
import { listColumns } from './contant';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/es/form';
import { Card, Form, Input, DatePicker, Button } from 'antd';
import { templatePage } from './api';
import { CommonTable } from '@/components';
import { momentRangeValueof } from '@/util/utils';
const { RangePicker } = DatePicker;
interface State {
  records: []
}
interface Props extends RouteComponentProps, FormComponentProps { }
class Page extends React.Component<Props, State> {
  state: State = {
    records: []
  }
  constructor(props: any) {
    super(props);
    this.fetchList = this.fetchList.bind(this);
  }
  componentDidMount() {
    this.fetchList();
  }
  async fetchList() {
    let { templateName, createTime, modifyTime } = this.props.form.getFieldsValue();
    let [createTimeStart, createTimeEnd] = createTime ? momentRangeValueof(createTime): [];
    let [modifyTimeStart, modifyTimeEnd] = modifyTime ? momentRangeValueof(modifyTime): [];
    const { records } = await templatePage({
      pageNo: 1,
      templateName,
      createTimeStart,
      createTimeEnd,
      modifyTimeStart,
      modifyTimeEnd
    });
    this.setState({
      records
    });
  }
  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Card>
        <Card title="筛选">
          <Form layout="inline">
            <Form.Item label="模板名称">
              {getFieldDecorator('templateName')(<Input placeholder="请输入模板名称" />)}
            </Form.Item>
            <Form.Item label="操作时间">
              {getFieldDecorator('modifyTime')(<RangePicker showTime format='YYYY-MM-DD HH:mm:ss'/>)}
            </Form.Item>
            <Form.Item label="创建时间">
              {getFieldDecorator('createTime')(<RangePicker showTime format='YYYY-MM-DD HH:mm:ss'/>)}
            </Form.Item>
            <Button type="primary" onClick={() => { this.props.history.push('/template/edit') }}>新增模板</Button>
            <Button className="ml10" onClick={() => { this.props.form.resetFields() }}>清除</Button>
            <Button className="ml10" type="primary" onClick={this.fetchList}>查询</Button>
          </Form>
        </Card>
        <Card>
          <CommonTable rowKey="createTime" columns={listColumns} dataSource={this.state.records} />
        </Card>
      </Card>
    );
  }
}

export default Form.create<Props>()(withRouter(Page));