import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      memberId: {
        label: '待清分流水号',
        type: 'input',
        controlProps: {
          placeholder: '请输入待清分流水号'
        }
      },
      nickName: {
        label: '交易编号',
        type: 'input',
        controlProps: {
          placeholder: '请输入交易编号'
        }
      },
      anchorIdentityType: {
        type: 'select',
        label: '交易类型',
        options: [
          { label: '普通订单', value: 20 },
          { label: '小店订单', value: 10 },
          { label: '直播订单', value: 30 },
          { label: '售后退款', value: 40 }
        ],
        controlProps: {
          placeholder: '请选择交易类型'
        }
      },
      anchorLevel: {
        label: '清分状态',
        type: 'select',
        options: [
          { label: '等待清分', value: 20 },
          { label: '清分完成', value: 10 }
        ],
        controlProps: {
          placeholder: '请选择清分状态'
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

export enum AnchorIdentityTypeEnum {
  供应商 = 20,
  公司 = 10,
  合作网红 = 30,
  代理 = 40
}

export enum AnchorLevelEnum {
  星级主播 = 10,
  普通主播 = 0
}