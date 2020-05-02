/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { closeTimerById, openTimerById, addTimer, getTimerList } from './api'
import { ListPage, If, FormItem } from '@/packages/common/components'
import { defaultConfig, NAME_SPACE } from './timer-config'
import { Button, Modal, Cascader, Select } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { FormInstance } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils'
import { RouteComponentProps } from 'react-router'
import StoreTimerModal from './timer-modal';
import dateFns from 'date-fns'

type Props = RouteComponentProps<{ id: string }>;

interface StoreFormState {
  readonly: boolean,
  data: any,
  visible: boolean
}
class Store extends Component {
  readonly: boolean = !!(parseQuery() as any).readOnly
  list: ListPageInstanceProps;
  state: StoreFormState = {
    readonly: this.readonly,
    data: {},
    visible: false,
  }
  form: FormInstance;
  provinceName: string;
  cityName: string;
  areaName: string;
  constructor(props: Props) {
    super(props)
  }
  columns = [{
    title: '批次名称',
    dataIndex: 'batchName'
  }, {
    title: '创建时间',
    render: (record: any) => <>{dateFns.format(record.createTime, 'YYYY-MM-DD HH:mm:ss')}</>
  }, {
    title: '生效时间',
    render: (record: any) => <>{dateFns.format(record.effectTime, 'YYYY-MM-DD HH:mm:ss')}</>
  }, {
    title: '类型',
    width: 200,
    render: (record: any) => {
      return record.type == 1 ? '上架' : '下架'
    }
  }, {
    title: '状态',
    width: 120,
    render: (record: any) => {
      return record.status == 0 ? '关闭' : '开启'
    }
  }, {
    title: '操作',
    width: 200,
    align: 'center',
    render: (record: any) => {
      return (
        <>
          <If condition={record.status === 0}>
            <span
              className='href ml10'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: '是否确定开启？',
                  onOk: () => {
                    openTimerById(record.id).then((res: any) => {
                      if (res) {
                        APP.success('开启成功')
                        this.list.refresh()
                      }
                    })
                  }
                })
              }}
            >
              开启
            </span>
          </If>
          <If condition={record.status === 1}>
            <span
              className='href ml10'
              onClick={() => {
                Modal.confirm({
                  title: '系统提示',
                  content: '是否确定关闭？',
                  onOk: () => {
                    closeTimerById(record.id).then((res: any) => {
                      if (res) {
                        APP.success('关闭成功')
                        this.list.refresh()
                      }
                    })
                  }
                })
              }}
            >
              关闭
            </span>
          </If>
          &nbsp;&nbsp;
          <span className='href' onClick={() => this.setState({
            data: record,
            visible: true
          })}>查看</span>
        </>
      )
    }
  }]



  render() {
    const { visible, data } = this.state
    return (
      <>
        <ListPage
          getInstance={ref => this.list = ref}
          rangeMap={{
            workDate: {
              fields: ['effectTimeStart', 'effectTimeEnd']
            }
          }}
          formItemLayout={(
            <>
              <FormItem label='商品批次名称' name='batchName' />
              <FormItem name='workDate' />
            </>
          )}

          addonAfterSearch={(
            <div className='mb10'>
              <Button type='danger' onClick={() => this.setState({ visible: true, data: {} })}>新建</Button>&nbsp;&nbsp;
              {/* <Button onClick={() => APP.history.push('/fresh/store/-1')}>开启</Button>&nbsp;&nbsp;
              <Button onClick={() => APP.history.push('/fresh/store/-1')}>关闭</Button> */}
            </div>
          )}
          namespace={NAME_SPACE}
          formConfig={defaultConfig}
          api={getTimerList}
          columns={this.columns}
        />
        {visible && <StoreTimerModal data={data} visible={visible} onOk={(data: any) => {

          this.setState({ visible: false })
        }} onCancel={() => this.setState({ visible: false })} />}
      </>
    )
  }

}
export default Store