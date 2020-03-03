import React from 'react';
import { getShopList } from './api';
import { ListPage, If, FormItem } from '@/packages/common/components';
import { defaultConfig, NAME_SPACE, statusEnum } from './config';
import { Button } from 'antd';

class Store extends React.Component {
  columns = [{
    title: '门店编号',
    dataIndex: 'shopCode'
  }, {
    title: '门店名称',
    dataIndex: 'shopName'
  }, {
    title: '类型',
    dataIndex: 'shopTypeText'
  }, {
    title: '创建时间',
    dataIndex: 'createTimeText'
  }, {
    title: '状态',
    dataIndex: 'statusText'
  }, {
    title: '操作',
    width: 220,
    render: (record: any) => {
      return (
        <>
          <span className='href'>查看</span>
          <span className='href ml10' onClick={() => APP.history.push(`/fresh/store/${record.id}`)}>编辑</span>
          <If condition={record.status === statusEnum['下线']}>
            <span className='href ml10'>上线</span>
          </If>
          <If condition={record.status === statusEnum['上线']}>
            <span className='href ml10'>下线</span>
          </If>
        </>
      )
    }
  }]
  render() {
    return (
      <>
        <ListPage
          rangeMap={{
            workDate: {
              fields: ['startWorkDate', 'endWorkDate']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='shopName' />
              <FormItem name='status' />
              <FormItem name='workDate' />
            </>
          )}
          addonAfterSearch={(
            <div className='mb10'>
              <Button type='danger' onClick={() => APP.history.push('/fresh/store/-1')}>新建门店</Button>
            </div>
          )}
          namespace={NAME_SPACE}
          formConfig={defaultConfig}
          api={getShopList}
          columns={this.columns}
        />
      </>
    )
  }
}

export default Store;