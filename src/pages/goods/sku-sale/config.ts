import { FieldsConfig } from '@/packages/common/components/form';

export const defaultConfig: FieldsConfig = {
  sku: {
    warehouseType: {
      label: '商品入库类型',
      type: 'radio',
      options: [{
        label: '入库商品',
        value: 1
      }, {
        label: '非入库商品',
        value: 0
      }],
      fieldDecoratorOptions: {
        initialValue: 1,
        rules: [{
          required: true,
          message: '请选择商品入库类型'
        }]
      }
    },
    checkType: {
      label: '商品校验类型',
      type: 'radio',
      options: [{
        label: '商品条码',
        value: 0
      }, {
        label: '库存商品ID',
        value: 1
      }],
      fieldDecoratorOptions: {
        initialValue: 0,
        rules: [{
          required: true,
          message: '请选择商品校验类型'
        }]
      }
    },
    productName: {
      label: '商品名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品名称'
        }]
      },
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    productShortName: {
      label: '商品简称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品简称'
        }]
      },
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    productCode: {
      label: '商品编码',
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    description: {
      label: '商品简介',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品简介'
        }]
      },
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    interception: {
      label: '是否可拦截发货',
      fieldDecoratorOptions: {
        initialValue: 0
      },
      type: 'radio',
      options: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }]
    },
    status: {
      label: '上架状态',
      type: 'radio',
      fieldDecoratorOptions: {
        initialValue: 3
      },
      options: [{
        label: '上架',
        value: 1
      }, {
        label: '下架',
        value: 0
      }, {
        label: '待上架',
        value: 3
      }]
    },
    showNum: {
      label: '累计销量',
      type: 'radio',
      fieldDecoratorOptions: {
        initialValue: 1,
        rules: [{
          required: true,
          message: '请选择累计销量'
        }]
      },
      options: [{
        label: '展示',
        value: 1
      }, {
        label: '不展示',
        value: 0
      }]
    },
    bulk: {
      label: '物流体积',
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    weight: {
      label: '物流重量',
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    isAuthentication: {
      label: '实名认证',
      type: 'radio',
      options: [{
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }],
      fieldDecoratorOptions: {
        initialValue: 0,
        rules: [{
          required: true,
          message: '请选择实名认证'
        }]
      }
    },
    // isCalculateFreight: {
    //   label: '单独计算运费',
    //   type: 'select',
    //   fieldDecoratorOptions: {
    //     initialValue: 0,
    //     rules: [{
    //       required: true,
    //       message: '请选择是否进行单独计算运费'
    //     }]
    //   },
    //   controlProps: {
    //     style: {
    //       width: '60%'
    //     }
    //   },
    //   options: [{
    //     label: '否',
    //     value: 0
    //   }, {
    //     label: '是',
    //     value: 1
    //   }]
    // }
  }
}