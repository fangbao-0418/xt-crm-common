import React from 'react'
import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
import SupplierSelect from '@/components/supplier-selector'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      id: {
        type: 'input',
        label: '调整单ID',
        controlProps: {
          type: 'number',
          style: { width: 150 }
        }
      },
      serialNo: {
        type: 'input',
        label: '对账单ID',
        controlProps: {
          type: 'number',
          style: { width: 150 }
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '对账单ID不能为空' }
          ]
        }
      },
      accNo: {
        type: 'input',
        label: '对账单ID',
        controlProps: {
          style: { width: 150 },
          maxLength: 32
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '对账单ID不能为空' },
            { max: 32, message: '长度最大32个字符' }
          ]
        }
      },
      billType: {
        type: 'select',
        label: '调整类型',
        options: [
          { label: '收入', value: 10 },
          { label: '支出', value: 20 }
        ],
        fieldDecoratorOptions: {
          // initialValue: 1,
          rules: [
            { required: true, message: '调整类型不能为空' }
          ]
        }
      },
      billStatus: {
        label: '状态',
        type: 'select',
        options: [
          { label: '待初审', value: 10 },
          { label: '待复审', value: 20 },
          { label: '审核通过', value: 30 },
          { label: '审核不通过', value: 40 },
          { label: '已撤销', value: 50 }
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
        type: 'input',
        // options: [
        //   {label: '订单补发', value: 1},
        //   {label: '运费补贴', value: 3},
        //   {label: '平台补贴', value: 2},
        //   {label: '售后扣款', value: 4},
        //   {label: '售后补偿', value: 5}
        // ],
        controlProps: {
          maxLength: 50
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '调整原因不能为空' },
            { max: 50, message: '长度最大50个字符' }
          ]
        }
      },
      createType: {
        type: 'select',
        label: '创建人类型',
        options: [
          { label: '员工', value: 10 }
        ]
      },
      createName: {
        type: 'input',
        label: '创建人',
        controlProps: {
          placeholder: '请选择供应商/员工名称'
        }
      },
      createTime: {
        type: 'rangepicker',
        label: '创建时间',
        controlProps: {
          showTime: true
        }
      },
      billMoney: {
        type: 'number',
        label: '调整金额',
        controlProps: {
          precision: 2,
          min: 0,
          max: 100000000,
          style: { width: '100%' }
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '调整金额不能为空' }
          ]
        }
      },
      /** 审核说明 */
      auditRemark: {
        type: 'textarea',
        label: '审核说明',
        controlProps: {
          maxLength: 250
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '审核说明不能为空' },
            { max: 250, message: '长度最大250个字符' }
          ]
        }
      },
      /** 调整说明 */
      trimExplain: {
        type: 'textarea',
        label: '调整说明',
        controlProps: {
          maxLength: 250
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '调整说明不能为空' },
            { max: 250, message: '长度最大250个字符' }
          ]
        }
      },
      /** 审核意见 */
      auditOpinion: {
        type: 'radio',
        label: '审核意见',
        fieldDecoratorOptions: {
          initialValue: 10
        },
        options: [
          { label: '审核通过', value: 10 },
          { label: '审核不通过', value: 20 }
        ]
      },
      supplierNameSelect: {
        label: '供应商',
        inner: (form) => {
          return form.getFieldDecorator('supplier', {
            rules: [
              {
                required: true,
                message: '请输入供应商名称'
              }
            ]
          })(
            <SupplierSelect
              style={{ width: 200 }}
              category={5}
            />
          )
        }
      },
      supplierId: {
        type: 'number',
        label: '供应商ID',
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '供应商ID不能为空' }
          ]
        },
        controlProps: {
          style: {
            width: 150
          }
        }
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
 * 创建者类型：10 员工
 */
export enum CreatedTypeEnum {
  员工 = 10
}

/**
 * 调整类型 10-收入，20-支出
 */
export enum BillTypeEnum {
  收入 = 10,
  支出 = 20
}

/**
 * 调整状态
 */
export enum BillStatusEnum {
  待初审 = 10,
  待复审 = 20,
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