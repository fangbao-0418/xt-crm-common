import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      memberId: {
        label: '门店名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入门店名称'
        }
      },
      nickName: {
        label: '店铺类型',
        type: 'input',
        controlProps: {
          placeholder: '请输入账务对象ID'
        }
      },
      status2: {
        label: '创建时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      },
      coupon1: {
        label: '选择店铺',
        type: 'input',
        controlProps: {
          placeholder: '请输入门店名称'
        }
      },
      coupon2: {
        label: '权重',
        type: 'input',
        controlProps: {
          placeholder: '请输入门店名称'
        }
      },
      coupon3: {
        label: '门店名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入门店名称'
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}
