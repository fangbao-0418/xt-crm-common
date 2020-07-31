import React from 'react'
import { FieldsConfig } from '@/packages/common/components/form'
import SuppilerSelector from '@/components/supplier-selector'
import RangeInput from '@/components/range-input'

export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      a: {
        label: '订单编号'
      },
      b: {
        label: '补偿单编号'
      },
      c: {
        label: '用户手机号'
      },
      d: {
        label: '创建人'
      },
      e: {
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
          label: '优惠券补偿',
          value: 1
        }, {
          label: '现金转账',
          value: 0
        }, {
          label: '喜团余额补偿',
          value: -1
        }]
      },
      f: {
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
          value: 1
        }, {
          label: '待客服主管审核',
          value: 0
        }, {
          label: '待客服经理审核',
          value: -1
        }, {
          label: '已关闭',
          value: 2
        }, {
          label: '已取消',
          value: 3
        }, {
          label: '已完成',
          value: 4
        }, {
          label: '发放失败',
          value: 5
        }]
      },
      g: {
        label: '申请时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      },
      h: {
        label: '补偿金额',
        inner: (form) => {
          return form.getFieldDecorator('h')(
            <RangeInput />
          )
        }
      },
      w: {
        label: '责任归属',
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
          label: '喜团补偿',
          value: 1
        }, {
          label: '供应商补偿',
          value: 0
        }]
      },
      i: {
        label: '供应商',
        inner: (form) => {
          return form.getFieldDecorator('store')(
            <SuppilerSelector type='yx' style={{ width: 172 }} />
          )
        }
      },
      j: {
        label: '店铺名称'
      }
    }
  }
  return defaultConfig
}