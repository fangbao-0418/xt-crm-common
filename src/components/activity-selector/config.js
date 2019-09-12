import React from 'react';
import activityType from '@/enum/activityType';
import DateFns from 'date-fns';
export const actColumns = (data = []) => {
  return [
    {
      title: '活动ID',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '活动名称',
      dataIndex: 'title',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      render: text => (
        <>
          {activityType.getValue(text)}
        </>
      ),
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: text => <>{text === 0 ? '关闭' : '开启'}</>,
    }
  ]
};