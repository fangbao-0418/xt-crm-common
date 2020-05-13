import React from 'react'
import { ListPage, FormItem, If, SelectFetch } from '@/packages/common/components'
import { getPages, effectProduct, invalidProduct } from './api'
// import { getCategoryTopList } from './api';
import { defaultConfig, statusEnums } from './config'
import { Modal, Button, Popconfirm } from 'antd'
type Key = string | number;

class Index extends React.Component<any> {
  list: any;

  update (payload: any) {
    // 是否失效
    const isInvalid = payload.status === statusEnums['失效']
    const params = { ids: [payload.id] }
    const promiseResult = isInvalid ? invalidProduct(params) : effectProduct(params)
    promiseResult.then((res: any)=> {
      if (res) {
        APP.success('操作成功')
        this.list.refresh()
      }
    })
  }
  columns = [{
    title: '序号',
    width: 120,
    dataIndex: 'id'
  }, {
    title: '售卖区域名称',
    width: 200,
    dataIndex: 'name'
  }, {
    title: '发布时间',
    width: 150,
    dataIndex: 'createTime'
  }, {
    title: '操作',
    width: 150,
    align: 'center',
    fixed: 'right',
    render: (records: any) => {
      return (
        <>
        <span
          className='href'
          onClick={() => {
            APP.history.push(`/goods/sku-stock/${records.id}`)
          }}
        >
            查看
        </span>
          <span
            className='href'
            style={{ marginLeft: 8, marginRight: 8 }}
            onClick={() => {
              APP.history.push(`/goods/sku-stock/${records.id}`)
            }}
          >
            编辑
          </span>
          <If condition={ records.status !== statusEnums['失效']}>
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

  handleAdd = () => {
    APP.history.push('/fresh/area/-1')
  }
  render () {
    return (
      <ListPage
        namespace='area_management'
        reserveKey='area_management'
        formItemLayout={(
          <>
            <FormItem name='name' />
          </>
        )}
        tableProps={{
          scroll: {
            x: true
          }
        }}
        addonAfterSearch={(
          <div>
            <Button
              type='primary'
              onClick={this.handleAdd}
            >
              新增
            </Button>
          </div>
        )}
        getInstance={ref => this.list = ref}
        formConfig={defaultConfig}
        api={getPages}
        columns={this.columns}
      />
    )
  }
}

export default Index