import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      memberId: {
        label: '账务结算ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入账务结算ID'
        }
      },
      nickName: {
        label: '账务对象ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入账务对象ID'
        }
      },
      anchorIdentityType: {
        label: '账务结算对象名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入账务结算对象名称'
        }
      },
      anchorLevel: {
        type: 'select',
        label: '收支类型',
        options: [
          { label: '收入', value: 20 },
          { label: '支出', value: 10 }
        ],
        controlProps: {
          placeholder: '请选择收支类型'
        }
      },
      status1: {
        type: 'select',
        label: '处理状态',
        options: [
          { label: '待结算', value: 20 },
          { label: '已结算', value: 10 }
        ],
        controlProps: {
          placeholder: '请选择处理状态'
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
