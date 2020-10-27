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
      accountSettleId: {
        label: '账户结算ID'
      },
      // compensatePayType: {
      //   label: '补偿类型',
      //   inner: (form) => {
      //     return form.getFieldDecorator('compensatePayType')(
      //       <SelectFetch
      //         style={{ width: '174px' }}
      //         fetchData={() => {
      //           return api.getCompensatePayList().then(res => {
      //             return res.map((item: any) => ({
      //               label: item.compensatePayName,
      //               value: item.compensatePayType
      //             }))
      //           })
      //         }}
      //       />
      //     )
      //   }
      // },
      compensatePayType: {
        label: '补偿类型',
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
          label: '喜团账户余额',
          value: 11
        }, {
          label: '支付宝转账',
          value: 12
        }, {
          label: '微信转账',
          value: 13
        }, {
          label: '优惠券',
          value: 10
        }]
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
      store: {
        label: '供应商',
        inner: (form) => {
          return form.getFieldDecorator('store')(
            <SearchFetch
              labelInValue
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
      shop: {
        label: '店铺名称',
        inner: (form) => {
          return form.getFieldDecorator('shop')(
            <SearchFetch
              labelInValue
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
      },
      orderBizType: {
        label: '补偿渠道',
        type: 'select',
        options: [{
          label: '全部',
          value: -1
        }, {
          label: '喜团优选',
          value: 0
        }, {
          label: '喜团好店',
          value: 30
        }]
      }
    }
  }
  return defaultConfig
}

export enum CompensateStatusEnum {
  '待客服组长审核' = 5,
  '待客服主管审核' = 10,
  '待客服经理审核' = 15,
  '已拒绝' = 30,
  '已完成' = 35,
  '已取消' = 40,
  '发放中' = 20,
  '发放失败' = 25
}

export enum OrderStatusEnum {
  '待付款' = 5,
  '待发货' = 20,
  '部分发货' = 25,
  '已发货' = 30,
  '已收货' = 40,
  '完成' = 50,
  '关闭' = 60
}

export enum MemberTypeEnum {
  '普通会员' = 0,
  '团长' = 10,
  '区长' = 20,
  '合伙人' = 30,
  '管理员' = 40,
  '公司' = 50
}

export enum PayTypeEnum {
  '微信APP' = 100,
  '微信小程序' = 101,
  '微信公众号' = 102,
  '支付宝APP' = 200,
  '支付宝H5' = 201,
  '花呗' = 202
}

export enum CompensatePayTypeEnum {
  '喜团账户余额' = 11,
  '支付宝转账' = 12,
  '微信转账' = 13,
  '优惠券' = 10
}

export enum CustomerRoleEnums {
  '普通客服' = 1,
  '客服组长' = 2,
  '客服主管' = 3,
  '客服经理' = 4,
}

// 补偿渠道
export enum orderBizTypeEnums {
  '喜团优选' = 0,
  '喜团买菜' = 10,
  '喜团好店' = 30
}