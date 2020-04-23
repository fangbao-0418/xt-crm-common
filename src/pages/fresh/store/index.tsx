/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import { getShopList, onOrOffShop, getStatusEnum } from './api'
import { ListPage, If, FormItem, SelectFetch } from '@/packages/common/components'
import { defaultConfig, NAME_SPACE, statusEnum } from './config'
import { Button, Modal, Cascader, Select } from 'antd'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import CitySelect from '@/components/city-select'
import { FormInstance } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils'
import { RouteComponentProps } from 'react-router'
import * as api from './api'
const Option = Select.Option
type Props = RouteComponentProps<{id: string}>;

const namespace = 'fresh-goods-check'
interface StoreFormState {
  address: string,
  readonly: boolean,
  cityList: any,
  countrys: any,
  country: any,
}
class Store extends Component {
  readonly: boolean = !!(parseQuery() as any).readOnly
  list: ListPageInstanceProps;
  state: StoreFormState = {
    address: '',
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
    const { readonly } = this.state
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
              <FormItem label='店长手机号' name='mobile' />
              <FormItem label='邀请店长手机号' name='mobile1' />

              {/* <FormItem
                label='省'
                inner={(form) => {
                  return readonly ? this.state.address : form.getFieldDecorator('province', {
                    rules: [{
                      required: true,
                      message: '请选择省份'
                    }]
                  })(<Select
                    key={1}
                    style={{ width: '100%' }}
                    showSearch
                    placeholder='请选择省份'
                    notFoundContent=''
                    onSearch={this.onSearchCountry.bind(this)}
                  >
                    {this.countryList()}
                  </Select>)
                }}
              />
              */}
               <FormItem
                 label='省市区'
                 inner={(form) => {
                   return readonly ? this.state.address : form.getFieldDecorator('address', {
                   })(<CitySelect
                     type='1'
                     getSelectedValues={(value: any[]) => {
                       if (Array.isArray(value) && value.length === 3) {
                         this.provinceName = value[0].label
                         this.cityName = value[1].label
                         this.areaName = value[2].label
                       }
                     }}
                   />)
                 }}
               />
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
  //  ajaxData = async (e: any) => {
  //    APP.fn.setPayload(
  //      namespace,
  //      e
  //    )
  //    const res = (await api.getShopList(e)) || {}
  //    this.setState({ countrys: res.records })
  //    console.log('res=>111', res)
  //  };
  //   //国家展示
  //   countryList=()=>{
  //     const { countrys } = this.state
  //     const data: any = []
  //     {
  //       countrys&&countrys.map((item: any, index: any)=>{
  //         data.push(<Option key={index} value={item.code}>{item.areaName}</Option>)
  //       })
  //     }
  //     return data
  //   }
  //   onSearchCountry (e: any) {
  //     if (e) {
  //       this.ajaxData({ areaName: e })
  //     }
  //   }
}
export default Store