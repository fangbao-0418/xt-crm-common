import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { FormComponentProps } from 'antd/es/form';
import { Card, Form, Input, DatePicker, Button } from 'antd';
import { templatePage } from './api';
import { CommonTable } from '@/components';
import { momentRangeValueof } from '@/util/utils';
import moment from 'moment';
import MoneyRender from '@/components/money-render';
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
    const listColumns = [
      {
        title: '序号',
        render(text: any, record: any, index: number) {
          return index + 1;
        },
      },
      {
        title: '模板名称',
        dataIndex: 'templateName',
        key: 'templateName',
      },
      {
        title: '默认运费/元',
        dataIndex: 'commonCost',
        key: 'commonCost',
        render: MoneyRender
      },
      {
        title: '指定运费地区',
        dataIndex: 'area',
        key: 'area',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render(text: any) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        render(text: any) {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        title: '操作',
        render: (text: any, record: any) => {
          return <Button type="link" onClick={() => {
            this.props.history.push(`/template/edit/${record.freightTemplateId}`);
          }}>编辑</Button>;
        },
      },
    ];
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