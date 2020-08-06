import React from 'react'
import { FieldsConfig } from '@/packages/common/components/form'
import SelectFetch from '@/components/select-fetch'
import SearchFetch from '@/components/search-fetch'
// import SuppilerSelector from '@/components/supplier-selector'
import RangeInput from '@/components/range-input'
import * as api from './api'

export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      childOrderCode: {
        label: '订单编号',
        controlProps: {
          placeholder: '请输入子订单编号'
        }
      },
      compensateCode: {
        label: '补偿单编号'
      },
      memberPhone: {
        label: '用户手机号'
      },
      creatorName: {
        label: '创建人',
        controlProps: {
          placeholder: '请输入创建人名称'
        }
      },
      compensatePayType: {
        label: '补偿类型',
        inner: (form) => {
          return form.getFieldDecorator('compensatePayType')(
            <SelectFetch
              style={{ width: '174px' }}
              fetchData={() => {
                return api.getCompensatePayList().then(res => {
                  return res.map((item: any) => ({
                    label: item.compensatePayName,
                    value: item.compensatePayType
                  }))
                })
              }}
            />
          )
        }
      },
      compensateStatus: {
        label: '补偿单状态',
        type: 'select',
        controlProps: {
          style: {
            width: 172
          }
        },
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '待客服组长审核',
          value: 5
        }, {
          label: '待客服主管审核',
          value: 10
        }, {
          label: '待客服经理审核',
          value: 15
        }, {
          label: '已拒绝',
          value: 30
        }, {
          label: '已完成',
          value: 35
        }, {
          label: '已取消',
          value: 40
        }, {
          label: '发放中',
          value: 20
        }, {
          label: '发放失败',
          value: 25
        }]
      },
      createTime: {
        label: '申请时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      },
      compensateAmount: {
        label: '补偿金额',
        inner: (form) => {
          return form.getFieldDecorator('compensateAmount')(
            <RangeInput />
          )
        }
      },
      responsibilityType: {
        label: '责任归属',
        inner: (form) => {
          return form.getFieldDecorator('responsibilityType')(
            <SelectFetch
              style={{ width: '174px' }}
              fetchData={() => {
                return api.getResponsibilityList().then(res => {
                  return res.map((item: any) => ({
                    label: item.responsibilityName,
                    value: item.responsibilityType
                  }))
                })
              }}
            />
          )
        }
      },
      storeId: {
        label: '供应商',
        inner: (form) => {
          return form.getFieldDecorator('storeId')(
            <SearchFetch
              style={{ width: '174px' }}
              placeholder='请输入供应商名称'
              api={(name) => {
                return api.getSupplierList({ name, searchType: 2 }).then(res => {
                  return res.map((item: any) => ({
                    text: item.name,
                    value: item.id
                  }))
                })
              }}
            />
          )
        }
      },
      shopId: {
        label: '店铺名称',
        inner: (form) => {
          return form.getFieldDecorator('shopId')(
            <SearchFetch
              style={{ width: '174px' }}
              placeholder='请输入店铺名称'
              api={(name) => {
                return api.getSupplierList({ name, searchType: 1 }).then(res => {
                  return res.map((item: any) => ({
                    text: item.name,
                    value: item.id
                  }))
                })
              }}
            />
          )
        }
      }
    }
  }
  return defaultConfig
}