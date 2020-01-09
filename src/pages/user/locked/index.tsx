import * as React from 'react';
import ListPage from '@/packages/common/components/list-page';
import { lockedFormConfig } from '../config'
interface LockedState {}

class Locked extends React.Component<{}, LockedState> {
  columns = [{
    title: '事件',
    key: 'eventCode',
    dataIndex: 'eventCode'
  }, {
    title: '手机号码',
    key: 'phone',
    dataIndex: 'phone'
  }, {
    title: '时间',
    key: '',
    dataIndex: ''
  }, {
    title: '原因',
    key: '',
    dataIndex: ''
  }]
  render() {
    return (
      <ListPage
        formConfig={lockedFormConfig}
        columns={this.columns}
        api={() => Promise.resolve({ records: []})}
      />
    )
  }
}

export default Locked;