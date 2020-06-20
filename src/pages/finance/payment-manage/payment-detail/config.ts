import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      tradeNo: {
        label: '交易编号',
        type: 'input',
        controlProps: {
          placeholder: '请输入交易编号'
        }
      },
      tradeType: {
        label: '交易类型',
        type: 'select',
        options: [
          { label: '订单收入', value: 1 },
          { label: '运费收入', value: 3 },
          { label: '售后退款', value: 2 },
          { label: '运费退款', value: 4 }
        ],
        controlProps: {
          placeholder: '请选择交易类型'
        }
      },
      settlementStatus: {
        type: 'select',
        label: '结算状态',
        options: [
          { label: '待结算', value: 0 },
          { label: '冻结中', value: -1 },
          { label: '已结算', value: 2 },
          { label: '结算关闭', value: -2 }
        ],
        controlProps: {
          placeholder: '请选择结算状态'
        }
      },
      storeId: {
        label: '供应商ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入供应商ID'
        }
      },
      storeName: {
        label: '供应商名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入供应商名称'
        }
      },
      storeType: {
        type: 'select',
        label: '供应商类型',
        options: [
          { label: '喜团优选', value: 1 },
          { label: '喜团小店', value: 2 }
        ],
        controlProps: {
          placeholder: '请选择供应商类型'
        }
      },
      time: {
        label: '创建时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}

export enum StoreTypeEnum {
  喜团优选 = 1,
  喜团小店 = 2
}

export enum AnchorLevelEnum {
  星级主播 = 10,
  普通主播 = 0
}