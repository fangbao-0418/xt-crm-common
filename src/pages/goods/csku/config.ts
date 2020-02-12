import { FieldsConfig } from '@/packages/common/components/form';

export const searchFormCondig: FieldsConfig = {
  csku: {
    productBasicId: {
      label: '库存商品ID'
    },
    productCode: {
      label: '商品编码'
    },
    productName: {
      label: '商品名称'
    },
    barCode: {
      label: '商品条码' 
    },
    categoryId: {
      label: '类目'
    },
    status: {
      label: '在库状态',
      type: 'select',
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
    // storeId: {
    //   label: '供应商'
    // },
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
    }
  }
}

export const formConfig: FieldsConfig = {
  cskuForm: {
    name: {
      label: '商品名称',
      controlProps: {
        style: {
          width: 172
        }
      },
      fieldDecoratorOptions: {
        rules: [{
          required: true
        }]
      }
    },
    shortName: {
      label: '商品简称',
      controlProps: {
        style: {
          width: 172
        }
      },
      fieldDecoratorOptions: {
        rules: [{
          required: true
        }]
      }
    },
    introduction: {
      label: '商品简介',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    code: {
      label: '商品编码',
      controlProps: {
        style: {
          width: 172
        }
      }
    }
  }
}

export enum statusEnums {
  失效 = 0,
  正常 = 1,
  异常 = 2,
  售罄 = 3
}