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
          { label: '支付退货', value: 20 }
        ]
      },
      anchorLevel: {
        type: 'select',
        label: '清分状态',
        options: [
          { label: '待分账', value: 20 },
          { label: '分账成功', value: 20 },
          { label: '分账关闭', value: 20 },
          { label: '分账失败', value: 20 }
        ]
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