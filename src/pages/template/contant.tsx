import React from 'react';
import moment from 'moment';
import { Button } from 'antd';
import MoneyRender from '@/components/money-render';
export const listColumns = [
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
    render() {
      return <Button type="link">编辑</Button>;
    },
  },
];