import * as React from 'react';
import ListPage from '@/packages/common/components/list-page';
import { FormItem } from '@/packages/common/components/form'
import SelectFetch from '@/packages/common/components/select-fetch'
import { getLockedList, getEventsList } from './api';

interface LockedState {}

class Locked extends React.Component<{}, LockedState> {
  columns = [{
    title: '事件',
    key: 'eventDescribe',
    dataIndex: 'eventDescribe'
  }, {
    title: '手机号码',
    key: 'phone',
    dataIndex: 'phone'
  }, {
    title: '时间',
    key: 'createTimeText',
    dataIndex: 'createTimeText'
  }, {
    title: '原因',
    key: 'resultMessage',
    dataIndex: 'resultMessage'
  }]
  render() {
    return (
      <ListPage
        rangeMap={{
          time: {
            fields: ['startTime', 'endTime'],
            format: 'YYYY-MM-DD HH:mm:ss'
          }
        }}
        formConfig={{}}
        formItemLayout={(
          <>
            <FormItem
              name='phone'
              label='手机号码'
            />
            <FormItem
              label='事件类型'
              inner={(form) => {
                return form.getFieldDecorator('eventCode')(
                  <SelectFetch fetchData={getEventsList}/>
                )
              }}
            />
            <FormItem
              name='time'
              label='时间范围'
              type='rangepicker'
              controlProps={{
                showTime: true
              }}
            />
          </>
        )}
        columns={this.columns}
        api={getLockedList}
      />
    )
  }
}

export default Locked;