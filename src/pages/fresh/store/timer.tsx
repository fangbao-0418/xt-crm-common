/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { getShopList, onOrOffShop, getTimerList } from './api'
import { ListPage, If, FormItem, SelectFetch } from '@/packages/common/components'
import { defaultConfig, NAME_SPACE } from './timer-config'
import { Button, Modal, Cascader, Select } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { FormInstance } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils'
import { RouteComponentProps } from 'react-router'
import StoreTimerModal from './timer-modal';
const Option = Select.Option
type Props = RouteComponentProps<{id: string}>;

interface StoreFormState {
  readonly: boolean,
  cityList: any,
  countrys: any,
  country: any,
}
class Store extends Component {
  readonly: boolean = !!(parseQuery() as any).readOnly
  list: ListPageInstanceProps;
  state: StoreFormState = {
    readonly: this.readonly,
    cityList: [],
    countrys: [],
    country: ''
  }
  form: FormInstance;
  provinceName: string;
  cityName: string;
  areaName: string;
  constructor (props: Props) {
    super(props)
  }
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
          <span className='href' onClick={() => APP.history.push(`/fresh/store/${record.id}?readOnly=1`)}>查看</span>
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
              <FormItem label='门店批次名称' name='shopPhone' />
              <FormItem name='workDate' />
            </>
          )}

          addonAfterSearch={(
            <div className='mb10'>
              <Button type='danger' onClick={() => APP.history.push('/fresh/store/-1')}>新建</Button>&nbsp;&nbsp;
              <Button onClick={() => APP.history.push('/fresh/store/-1')}>开启</Button>&nbsp;&nbsp;
              <Button onClick={() => APP.history.push('/fresh/store/-1')}>关闭</Button>
            </div>
          )}
          namespace={NAME_SPACE}
          formConfig={defaultConfig}
          api={getShopList}
          columns={this.columns}
        />
        <StoreTimerModal visible={true}/>
      </>
    )
  }

}
export default Store