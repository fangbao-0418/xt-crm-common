import React from 'react'
import { getShopList, onOrOffShop } from './api'
import { ListPage, If, FormItem } from '@/packages/common/components'
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
    dataIndex: 'createTimeText'
  }, {
    title: '状态',
    dataIndex: 'statusText'
  }, {
    title: '操作',
    width: 200,
    align: 'center',
    render: (record: any) => {
      return (
        <>
          <span className='href' onClick={() => APP.history.push(`/fresh/store/${record.id}?readOnly=1`)}>查看</span>
          <span className='href ml10' onClick={() => APP.history.push(`/fresh/store/${record.id}`)}>编辑</span>
          <If condition={[statusEnum['新建'], statusEnum['下线']].includes(record.status)}>
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
          <If condition={record.status === statusEnum['上线']}>
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
              fields: ['startWorkDate', 'endWorkDate']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='name' />
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

export default Store