import { OptionProps } from '@/packages/common/components/form/index'
import _ from 'lodash'
import * as api from './api'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    afterSale: {
      refundStatus: {
        type: 'select',
        label: '售后状态',
        options: [
          { label: '待合伙人审核', value: 10 },
          { label: '待返回仓库', value: 20 },
          { label: '售后完成', value: 30 },
          { label: '售后关闭', value: 40 },
          { label: '售后取消', value: 50 }
        ],
        controlProps: {
          style: {
            width: 150
          }
        }
      },
      refundCode: {
        type: 'input',
        label: '售后单号'
      },
      childOrderCode: {
        type: 'input',
        label: '订单编号'
      },
      productName: {
        type: 'input',
        label: '商品名称'
      },
      contactPhone: {
        type: 'input',
        label: '收货人电话'
      },
      backStore: {
        type: 'select',
        label: '是否需要送回仓库',
        options: [
          { label: '所有', value: 0 },
          { label: '是', value: 10 },
          { label: '否', value: 20 }
        ]
      },
      createTime: {
        label: '发布时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return defaultConfig
}