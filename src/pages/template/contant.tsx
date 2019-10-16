import React from 'react';
import moment from 'moment';
import { Button, Radio } from 'antd';
import { ColumnProps } from 'antd/es/table';
import FareSelector from './FareSelector';
export const listColumns = [
  {
    title: '序号',
    render(text: any, record: any, index: number) {
      return index;
    },
  },
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '默认运费/元',
    dataIndex: 'freight',
    key: 'freight',
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

export const editColumns: ColumnProps<any>[] = [
  {
    title: '编号',
    key: 'id',
    render(text: any, record: any, index: number) {
      return index + 1;
    },
  },
  {
    title: '目的地',
    key: 'areas',
    render(text: any) {
      return <>11</>;
    },
  },
  {
    title: '运费/元',
    key: 'fare',
    render() {
      return <FareSelector />
    },
  },
  {
    title: '操作',
    key: 'operate',
    render() {
      return <Button type="link">删除</Button>;
    },
  },
];
