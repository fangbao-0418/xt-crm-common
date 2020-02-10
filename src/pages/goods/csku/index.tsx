import React from 'react';
import { ListPage, If } from '@/packages/common/components';
import { updateStatus, batchExport } from './api';
import { defaultConfig, statusEnums } from './config';
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, Popconfirm } from 'antd';
type Key = string | number;
interface ListState {
  selectedRowKeys: Key[]
}
class List extends React.Component<any, ListState> {
  list: ListPageInstanceProps;
  state = {
    selectedRowKeys: []
  }
  update(payload: any) {
    updateStatus(payload).then(res => {
      if (res) {
        const msg = payload.status === statusEnums['正常'] ? '生效' : '失效';
        APP.success(`${msg}成功`);
        this.list.refresh();
      }
    })
  }
  onSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  columns = [{
    title: '商品ID'
  }, {
    title: '商品名称'
  }, {
    title: '商品编码'
  }, {
    title: '商品条码'
  }, {
    title: '总库存'
  }, {
    title: '锁定库存'
  }, {
    title: '供应商'
  }, {
    title: '状态',
    key: 'statusText',
    dataIndex: 'statusText'
  }, {
    title: '创建时间',
    key: 'createTimeText',
    dataIndex: 'createTimeText'
  }, {
    title: '最后操作时间',
    key: 'modifyTimeText',
    dataIndex: 'modifyTimeText'
  }, {
    title: '操作人'
  }, {
    title: '操作',
    render: (records: any) => {
      return (
        <>
          <Button type='link'>编辑</Button>
          <If condition={records.status === statusEnums['正常']}>
            <Popconfirm
              title='确定失效吗'
              onConfirm={() => {
                this.update({
                  id: records.id,
                  status: statusEnums['失效']
                })
              }}>
                <span className='href'>失效</span>
            </Popconfirm>
          </If>
          <If condition={records.status === statusEnums['失效']}>
            <Popconfirm
              title='确定生效吗'
              onConfirm={() => {
                this.update({
                  id: records.id,
                  status: statusEnums['正常']
                })
              }}>
                <span className='href'>生效</span>
            </Popconfirm>
          </If>
        </>
      )
    }
  }]
  // 批量操作
  batchAction(type: 0| 1 | 2) {
    switch (type) {
      case 0:
        batchExport({})
        break;
      case 1:
        break;
      case 2:
        break;
    } 
  }
  handleAdd = () => {
    APP.history.push('/goods/csku/-1');
  }
  render() {
    const { selectedRowKeys } = this.state;
    return (
      <ListPage
        tableProps={{
          rowSelection: {
            selectedRowKeys,
            onChange: this.onSelectChange
          }
        }}
        addonAfterSearch={(
          <div>
            <Button type='primary' onClick={this.handleAdd}>新增</Button>
            <Button type='primary' className='ml10' onClick={() => this.batchAction(0)}>批量导出</Button>
            <Button type='primary' className='ml10' onClick={() => this.batchAction(1)}>批量失效</Button>
            <Button type='primary' className='ml10' onClick={() => this.batchAction(2)}>批量生效</Button>
          </div>
        )}
        getInstance={ref => this.list = ref}
        formConfig={defaultConfig}
        api={() => Promise.resolve({ records: []})}
        columns={this.columns}
      />
    )
  }
}

export default List;