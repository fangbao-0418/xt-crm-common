import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      memberId: {
        type: 'input',
        label: '账单ID',
        controlProps: {
          placeholder: '请输入账单ID'
        }
      },
      nickName: {
        type: 'input',
        label: '供应商ID',
        controlProps: {
          placeholder: '请输入供应商ID'
        }
      },
      anchorIdentityType: {
        type: 'input',
        label: '供应商',
        controlProps: {
          placeholder: '请输入供应商名称'
        }
      },
      anchorLevel: {
        type: 'select',
        label: '供应商类型',
        options: [
          { label: '喜团优选', value: 10 },
          { label: '喜团小店', value: 0 }
        ]
      },
      status: {
        label: '生成时间',
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