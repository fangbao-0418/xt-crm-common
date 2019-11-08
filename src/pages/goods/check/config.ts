import { FieldsConfig, OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig  {
  const defaultConfig: FieldsConfig = {
    common: {
      productName: {
        label: '商品名称',
        type: 'input'
      },
      productId: {
        label: '商品ID',
        type: 'input'
      },
      firstCategoryName: {
        label: '一级类目',
        type: 'input'
      },
      supplierName: {
        label: '供应商名称',
        type: 'input'
      },
      auditStatus: {
        label: '审核状态',
        type: 'select',
        options: [{
          label: '全部',
          value: -1
        }, {
          label: '待提交',
          value: 0
        }, {
          label: '待审核',
          value: 1
        }, {
          label: '审核不通过',
          value: 2
        }, {
          label: '审核通过',
          value: 3
        }]
      },
      auditUser: {
        label: '审核人',
        type: 'input'
      },
      createTime: {
        label: '创建时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      },
      auditTime: {
        label: '审核时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      }
    }    
  }
  return defaultConfig;
}