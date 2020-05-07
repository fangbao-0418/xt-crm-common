import { FieldsConfig } from '@/packages/common/components/form';

export const defaultConfig: FieldsConfig = {
  freshSku: {
    productId: {
      label: '商品ID',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    goodsTime: {
      label: '创建时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    optionTime: {
      label: '操作时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    // interceptor: {
    //   label: '拦截状态',
    //   type: 'select',
    //   controlProps: {
    //     style: {
    //       width: 172
    //     }
    //   },
    //   options: [{
    //     label: '全部',
    //     value: ''
    //   }, {
    //     label: '是',
    //     value: 1
    //   }, {
    //     label: '否',
    //     value: 0
    //   }]
    // },
    // warehouseType: {
    //   label: '商品入库类型',
    //   type: 'radio',
    //   options: [{
    //     label: '入库商品',
    //     value: 1
    //   }, {
    //     label: '非入库商品',
    //     value: 0
    //   }],
    //   fieldDecoratorOptions: {
    //     initialValue: 1,
    //     rules: [{
    //       required: true,
    //       message: '请选择商品入库类型'
    //     }]
    //   }
    // },
    productName: {
      label: '商品名称',
      controlProps: {
        maxLength: 20,
        placeholder: '请输入商品名称，不能超过20个字符'
      },
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品名称'
        }]
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
    // barCode: {
    //   label: '商品条码',
    //   controlProps: {
    //     style: {
    //       width: '60%'
    //     }
    //   }
    // },
    productCode: {
      label: '商品编码',
      controlProps: {
        style: {
          width: '60%'
        },
        maxLength: 20
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
    status: {
      label: '上架状态',
      type: 'radio',
      fieldDecoratorOptions: {
        initialValue: 0
      },
      options: [{
        label: '上架',
        value: 1
      }, {
        label: '下架',
        value: 0
      }]
    },
    settleType: {
      label: '结算模式',
      type: 'radio',
      fieldDecoratorOptions: {
        rules: [
          {
            validator: (rule, value, cb) => {
              if (![1, 2].includes(value)) {
                cb('请选择结算方式')
              }
              cb()
            }
          }
        ]
      },
      options: [{
        label: '寄售结算',
        value: 1
      }, {
        label: '按需结算',
        value: 2
      }]
    },
    // showNum: {
    //   label: '累计销量',
    //   type: 'radio',
    //   fieldDecoratorOptions: {
    //     initialValue: 1,
    //     rules: [{
    //       required: true,
    //       message: '请选择累计销量'
    //     }]
    //   },
    //   options: [{
    //     label: '展示',
    //     value: 1
    //   }, {
    //     label: '不展示',
    //     value: 0
    //   }]
    // },
    bulk: {
      label: '商品体积',
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    weight: {
      label: '商品重量',
      controlProps: {
        style: {
          width: '60%'
        }
      }
    },
    // isAuthentication: {
    //   label: '实名认证',
    //   type: 'radio',
    //   options: [{
    //     value: 1,
    //     label: '是'
    //   }, {
    //     value: 0,
    //     label: '否'
    //   }],
    //   fieldDecoratorOptions: {
    //     initialValue: 0,
    //     rules: [{
    //       required: true,
    //       message: '请选择实名认证'
    //     }]
    //   }
    // },
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