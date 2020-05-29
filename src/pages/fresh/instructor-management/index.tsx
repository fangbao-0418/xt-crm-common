import React from 'react'
import { ListPage, FormItem } from '@/packages/common/components'
import { getPages, deleteInstructor } from './api'
import { defaultConfig } from './config'
import { Modal, Button, Popconfirm } from 'antd'
import DateFns from 'date-fns'
type Key = string | number;

class Index extends React.Component<any> {
  list: any;

  update (id: any) {
    // 是否删除
    const promiseResult = deleteInstructor(id)
    promiseResult.then((res: any)=> {
      if (res) {
        APP.success('操作成功')
        this.list.refresh()
      }
    })
  }
  columns = [{
    title: '序号',
    width: 150,
    dataIndex: 'id'
  }, {
    title: '门店指导员名称',
    width: 120,
    dataIndex: 'name'
  }, {
    title: '手机号',
    width: 100,
    dataIndex: 'phone'
  }, {
    title: '发布时间',
    width: 200,
    dataIndex: 'createTime',
    render: (text: string | number | Date) => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
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
            APP.history.push(`/fresh/instructor/${records.id}?readOnly=readOnly`)
          }}
        >
            查看
        </span>
          <span
            className='href'
            style={{ marginLeft: 8, marginRight: 8 }}
            onClick={() => {
              APP.history.push(`/fresh/instructor/${records.id}`)
            }}
          >
            编辑
          </span>
            <Popconfirm
              title='确定删除吗'
              onConfirm={() => {
                this.update(records.id)
              }}>
              <span className='href'>删除</span>
            </Popconfirm>
        </>
      )
    }
  }]

  handleAdd = () => {
    APP.history.push('/fresh/instructor/-1')
  }
  render () {
    return (
      <ListPage
        namespace='area_management'
        reserveKey='area_management'
        formItemLayout={(
          <>
            <FormItem name='phone' />
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