import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      serialNo: {
        type: 'number', label: '对账单ID',
        controlProps: {
          style: {width: 150}
        }
      },
      storeName: {
        type: 'input', label: '供应商',
        controlProps: {
          placeholder: '请输入供应商名称'
        }
      },
      accStatus: {
        type: 'select', label: '状态',
        fieldDecoratorOptions: {
          initialValue: 10
        },
        options: [
          {label: '可申请结算', value: 10},
          {label: '结算中', value: 20},
          {label: '已结算', value: 30},
          {label: '冻结中', value: 40}
          // {label: '关闭', value: 60}
        ]
      }
    },
    statements: {
      currency: {
        type: 'select', label: '对账单ID',
        fieldDecoratorOptions: {
          initialValue: 1
        },
        options: [
          {label: '人民币', value: 1}
        ]
      },
      newAccount: {
        type: 'radio', label: '请选择账户',
        options: [
          {label: '新账户', value: 1},
          {label: '已有账户', value: 0}
        ],
        fieldDecoratorOptions: {
          initialValue: 1
        }
      },
      accountType: {
        type: 'radio', label: '账户类型',
        options: [
          // {label: '微信', value: 1},
          {label: '支付宝', value: 2},
          {label: '个人银行卡', value: 3},
          {label: '对公银行账户', value: 4}
        ],
        fieldDecoratorOptions: {
          initialValue: 2,
          rules: [
            {required: true, message: '请选择账户类型'}
          ]
        }
      },
      bankBranchName: {
        type: 'input', label: '银行支行名称',
        controlProps: {
          placeholder: '请选择收款账号银行名，例如中国银行杭州高新支行'
        },
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '请输入银行支行名称'}
          ]
        }
      },
      accountName: {
        type: 'input', label: '账户名',
        controlProps: {
          placeholder: '真实姓名或企业名称'
        }
      },
      accountCode: {
        type: 'input', label: '账号',
        controlProps: {
          placeholder: '手机号/邮箱'
        }
      },
      bankName: {
        type: 'input', label: '银行名称',
        controlProps: {
          placeholder: '请选择收款账号银行名称'
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}

/** @对账单状态（10：待结算；20：部分结算；30：已结清；40：已失效;60关闭） */
export enum AccStatusEnum {
  待确认 = 10,
  未结算 = 20,
  待结算 = 30,
  结算中 = 40,
  已结算 = 50,
  已结清 = 60,
  结算异常 = 70
}

/** 交易状态（1：完成 2：未完成 3：出现异常） */
export enum PaymentStatusEnum {
  完成 = 1,
  未完成 = 2,
  出现异常 = 3
}

/** 交易类型(1:订单收入 2：售后退款 3：运费收入 4：运费支出 5：优惠券退款) */
export enum PaymentTypeEnum {
  完成 = 1,
  未完成 = 2,
  出现异常 = 3
}
