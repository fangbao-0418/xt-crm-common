import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      memberId: {
        label: '申请单编号',
        type: 'input',
        controlProps: {
          placeholder: '请输入申请单编号'
        }
      },
      nickName: {
        type: 'input',
        label: '供应商名称',
        controlProps: {
          placeholder: '请输入供应商名称'
        }
      },
      anchorIdentityType: {
        label: '供应商ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入供应商ID'
        }
      },
      anchorLevel: {
        type: 'select',
        label: '供应商类型',
        options: [
          { label: '喜团优选', value: 10 },
          { label: '喜团小店', value: 0 }
        ],
        controlProps: {
          placeolder: '请选择供应商类型'
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择供应商类型'
            }
          ]
        }
      },
      status2: {
        type: 'select',
        label: '提现方式',
        fieldDecoratorOptions: {
          initialValue: 0
        },
        controlProps: {
          placeolder: '请选择提现方式'
        },
        options: [
          { label: '个人银行开', value: 1 },
          { label: '对公账户', value: 0 }
        ]
      },
      status3: {
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