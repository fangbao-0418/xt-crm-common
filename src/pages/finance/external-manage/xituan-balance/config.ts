import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      memberId: {
        label: '交易编号',
        type: 'input',
        controlProps: {
          placeholder: '请输入交易编号'
        }
      },
      nickName: {
        label: '交易类型',
        type: 'select',
        options: [
          { label: '订单收入', value: 20 },
          { label: '运费收入', value: 10 },
          { label: '售后退款', value: 30 },
          { label: '运费退款', value: 40 }
        ],
        controlProps: {
          placeholder: '请选择交易类型'
        }
      },
      anchorIdentityType: {
        type: 'select',
        label: '结算状态',
        options: [
          { label: '待结算', value: 20 },
          { label: '部分结算', value: 10 },
          { label: '已结算', value: 30 },
          { label: '结算关闭', value: 40 }
        ],
        controlProps: {
          placeholder: '请选择结算状态'
        }
      },
      anchorLevel: {
        label: '供应商ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入供应商ID'
        }
      },
      status: {
        label: '供应商名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入供应商名称'
        }
      },
      status1: {
        type: 'select',
        label: '供应商类型',
        options: [
          { label: '喜团优选', value: 20 },
          { label: '喜团小店', value: 10 }
        ],
        controlProps: {
          placeholder: '请选择供应商类型'
        }
      },
      status2: {
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