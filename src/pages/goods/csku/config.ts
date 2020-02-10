import { FieldsConfig } from '@/packages/common/components/form';

export const defaultConfig: FieldsConfig = {
  csku: {
    id: {
      label: '商品ID'
    },
    code: {
      label: '商品编码'
    },
    name: {
      label: '商品名称'
    },
    skucode: {
      label: '商品条码' 
    },
    category: {
      label: '类目'
    },
    status: {
      label: '在库状态'
    },
    operator: {
      label: '操作人'
    },
    supplier: {
      label: '供应商'
    },
    createTime: {
      label: '创建时间',
      type: 'rangepicker'
    },
    operatingTime: {
      label: '操作时间',
      type: 'rangepicker'
    }
  }
}


export enum statusEnums {
  正常 = 0,
  失效 = 1,
  异常 = 2,
  售罄 = 3
}