import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      id: {
        type: 'input', label: '调整单ID',
        controlProps: {
          style: { width: 150 }
        }
      },
      serialNo: {
        type: 'input', label: '对账单ID',
        controlProps: {
          style: { width: 150 }
        },
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '对账单ID不能为空'}
          ]
        }
      },
      accNo: {
        type: 'input', label: '对账单ID',
        controlProps: {
          style: { width: 150 }
        },
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '对账单ID不能为空'}
          ]
        }
      },
      accId: {
        type: 'input', label: '对账单ID',
        controlProps: {
          style: { width: 150 }
        },
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '对账单ID不能为空'}
          ]
        }
      },
      accName: {
        type: 'input',
        label: '对账单名称',
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '对账单名称不能为空'}
          ]
        }
      },
      trimType: {
        type: 'select',
        label: '调整类型',
        options: [
          {label: '收入', value: 1},
          {label: '支出', value: 2}
        ],
        fieldDecoratorOptions: {
          // initialValue: 1,
          rules: [
            {required: true, message: '调整类型不能为空'}
          ]
        }
      },
      trimStatus: {
        label: '状态',
        type: 'select',
        options: [
          {label: '代采购审核', value: 10},
          {label: '待财务审核', value: 20},
          {label: '审核通过', value: 30},
          {label: '审核不通过', value: 40},
          {label: '已撤销', value: 50}
        ]
        // fieldDecoratorOptions: {
        //   initialValue: 10,
        //   rules: [
        //     {required: true, message: '状态不能为空'}
        //   ]
        // }
      },
      trimReason: {
        label: '调整原因',
        type: 'select',
        options: [
          {label: '订单补发', value: 1},
          {label: '运费补贴', value: 3},
          {label: '平台补贴', value: 2},
          {label: '售后扣款', value: 4},
          {label: '售后补偿', value: 5}
        ],
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '调整原因不能为空'}
          ]
        }
      },
      createdType: {
        type: 'select',
        label: '创建人类型',
        options: [
          {label: '财务', value: 0},
          {label: '采购', value: 1},
          {label: '供应商', value: 3},
          {label: '员工', value: 2}
        ]
      },
      createName: {
        type: 'input', label: '创建人',
        controlProps: {
          placeholder: '请选择供应商/员工名称'
        }
      },
      createTime: {
        type: 'rangepicker', label: '创建时间',
        controlProps: {
          showTime: true
        }
      },
      trimMoney: {
        type: 'number', label: '调整金额',
        controlProps: {
          precision: 2,
          min: 0,
          style: {width: '100%'}
        },
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '调整金额不能为空'}
          ]
        }
      },
      /** 调整说明 | 审核说明 */
      trimExplain: {
        type: 'textarea', label: '调整说明',
        fieldDecoratorOptions: {
          rules: [
            {required: true, message: '调整说明不能为空'}
          ]
        }
      },
      reviewStatus: {
        type: 'radio', label: '审核意见',
        fieldDecoratorOptions: {
          initialValue: 0
        },
        options: [
          {label: '审核通过', value: 0},
          {label: '审核不通过', value: 1}
        ]
      },
      supplierName: {
        type: 'input', label: '供应商'
      },
      purchaseReviewName: {
        type: 'input', label: '采购审核人'
      },
      financeReviewName: {
        type: 'input', label: '财务审核人'
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}

/**
 * 创建者类型：0：财务 1：采购：2员工：3供应商
 */
export enum CreatedTypeEnum  {
  财务 = 0,
  采购 = 1,
  员工 = 2,
  供应商 = 3
}

/**
 * 调整类型 1-收入，2-支出
 */
export enum TrimTypeEnum {
  收入 = 1,
  支出 = 2
}

/**
 * 调整状态
 */
export enum TrimStatusEnum {
  代采购审核 = 10,
  待财务审核 = 20,
  审核通过 = 30,
  审核不通过 = 40,
  已撤销 = 50
}

/** 调整原因 1订单补发、2平台补贴、3运费补贴、4售后扣款、5售后补偿 */
export enum TrimReasonEnum {
  订单补发 = 1,
  平台补贴 = 2,
  运费补贴 = 3,
  售后扣款 = 4,
  售后补偿 = 5
}