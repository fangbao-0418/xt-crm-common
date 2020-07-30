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
        label: '分账流水号',
        type: 'input',
        controlProps: {
          placeholder: '请输入分账流水号'
        }
      },
      anchorIdentityType: {
        type: 'select',
        label: '分账类型',
        options: [
          { label: '供应商运费收入', value: 20 },
          { label: '供应商贷款收入', value: 10 },
          { label: '供应商运费退款', value: 30 },
          { label: '供应商货款退款', value: 40 },
          { label: '平台订单收入', value: 40 },
          { label: '平台运费收入', value: 40 },
          { label: '平台订单退款', value: 40 },
          { label: '平台运费退款', value: 40 }
        ],
        controlProps: {
          placeholder: '请选择分账类型'
        }
      },
      anchorLevel: {
        label: '分账对象ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入分账对象ID'
        }
      },
      status: {
        label: '交易编号',
        type: 'input',
        controlProps: {
          placeholder: '请输入交易编号'
        }
      },
      status1: {
        type: 'select',
        label: '分账状态',
        options: [
          { label: '记账成功', value: 20 },
          { label: '记账失败', value: 10 },
          { label: '待记账', value: 10 }
        ],
        controlProps: {
          placeholder: '请选择分账状态'
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