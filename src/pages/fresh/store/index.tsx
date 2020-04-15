import React from 'react'
import { getShopList, onOrOffShop, getStatusEnum } from './api'
import { ListPage, If, FormItem, SelectFetch } from '@/packages/common/components'
import { defaultConfig, NAME_SPACE, statusEnum } from './config'
import { Button, Modal } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'

class Store extends React.Component {
  list: ListPageInstanceProps;
  columns = [{
    title: '门店编号',
    dataIndex: 'code'
  }, {
    title: '门店名称',
    dataIndex: 'name'
  }, {
    title: '类型',
    dataIndex: 'typeText'
  }, {
    title: '创建时间',
    width: 200,
    dataIndex: 'createTimeText'
  }, {
    title: '申请时间',
    width: 200,
    dataIndex: 'applyTimeText'
  }, {
    title: '状态',
    width: 120,
    dataIndex: 'statusText'
  }, {
    title: '操作',
    width: 200,
    align: 'center',
    render: (record: any) => {
      return (
        <>
          <span className='href' onClick={() => APP.history.push(`/fresh/store/${record.id}?readOnly=1`)}>查看</span>
          <If condition={[1, 2, 3].includes(record.status)}>
            <span className='href ml10' onClick={() => APP.history.push(`/fresh/store/${record.id}`)}>编辑</span>
          </If>
          <If condition={[4].includes(record.status)}>
            <span className='href ml10' onClick={() => APP.history.push(`/fresh/store/${record.id}`)}>审核</span>
          </If>
          <If condition={[1, 3].includes(record.status)}>
            <span
              className='href ml10'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: '是否确定上线？',
                  onOk: () => {
                    onOrOffShop({ shopId: record.id, status: 2 }).then((res: any) => {
                      if (res) {
                        APP.success('上线成功')
                        this.list.refresh()
                      }
                    })
                  }
                })
              }}
            >
              上线
            </span>
          </If>
          <If condition={record.status === 2}>
            <span
              className='href ml10'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: '是否确定下线？',
                  onOk: () => {
                    onOrOffShop({ shopId: record.id, status: 3 }).then((res: any) => {
                      if (res) {
                        APP.success('下线成功')
                        this.list.refresh()
                      }
                    })
                  }
                })
              }}
            >
              下线
            </span>
          </If>
        </>
      )
    }
  }]
  render () {
    return (
      <>
        <ListPage
          getInstance={ref => this.list = ref}
          rangeMap={{
            workDate: {
              fields: ['startCreateDate', 'endCreateDate']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='name' />
              <FormItem
                // name='status'
                label='店铺状态'
                inner={(form) => {
                  return form.getFieldDecorator(
                    'status',
                    {}
                  )(<SelectFetch
                    fetchData={getStatusEnum}
                  />)
                }}
              />
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

export default Store