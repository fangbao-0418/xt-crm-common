import { FieldsConfig } from '@/packages/common/components/form';

export const defaultConfig: FieldsConfig = {
  skuStock: {
    productBasicId: {
      label: '库存商品ID',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    productName: {
      label: '商品名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品名称'
        }]
      }
    },
    barCode: {
      label: '商品条码'
    },
    status: {
      label: '在库状态',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [{
        label: '失效',
        value: 0
      }, {
        label: '正常',
        value: 1
      }, {
        label: '异常',
        value: 2
      }, {
        label: '售罄',
        value: 3
      }]
    },
    createTime: {
      label: '创建时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    modifyTime: {
      label: '操作时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    productShortName: {
      label: '商品简称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品简称'
        }]
      }
    },
    description: {
      label: '商品简介',
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    productCode: {
      label: '商品编码'
    }
  }
}

export enum statusEnums {
  失效 = 0,
  正常 = 1,
  异常 = 2,
  售罄 = 3
}