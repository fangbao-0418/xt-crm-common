import { FieldsConfig, OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig  {
  const defaultConfig: FieldsConfig = {
    common: {
      productName: {
        label: '商品名称1',
        type: 'input'
      },
      productId: {
        label: '商品ID',
        type: 'input'
      },
      primaryCategory: {
        label: '一级类目',
        type: 'input'
      },
      supplierName: {
        label: '供应商名称',
        type: 'input'
      },
      checkstatus: {
        label: '审核状态',
        type: 'select',
        options: [{
          label: '全部',
          value: 0
        }, {
          label: '待审核',
          value: 10
        }, {
          label: '审核不通过',
          value: 20
        }, {
          label: '审核通过',
          value: 30
        }]
      },
      checkPerson: {
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
      checkTime: {
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



// export interface FieldsConfig {
//   [namespace: string]: {[field: string]: OptionProps}
// }
// export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
//   const defaultConfig: FieldsConfig = {
//     common: {
//       productName: {
//         type: 'input', label: '商品名称'
//       },
//       productId: {
//         type: 'input', label: '商品ID',
//         controlProps: {
//           type: 'number'
//         }
//       },
//       status: {
//         type: 'select', label: '状态',
//         options: [
//           {label: '已上架', value: '0'},
//           {label: '已下架', value: '1'}
//         ] 
//       },
//       maxHbFqNum: {
//         type: 'select', label: '最大分期期数',
//         options: [
//           {label: '三期', value: '3'},
//           {label: '六期', value: '6'},
//           {label: '十二期', value: '12'}
//         ] 
//       },
//       maxFqSellerPercent: {
//         type: 'select', label: '最大免息期数',
//         options: [
//           {label: '三期', value: '3'},
//           {label: '六期', value: '6'},
//           {label: '十二期', value: '12'}
//         ] 
//       },
//     },
    /** 营销 */
    // marketing: {
    //   startTime: {
    //     type: 'rangepicker', label: '活动时间',
    //     controlProps: {
    //       showTime: true
    //     }
    //   },
    //   createTime: {
    //     type: 'rangepicker', label: '创建时间',
    //     controlProps: {
    //       showTime: true
    //     }
    //   },
    //   title: {
    //     type: 'input', label: '活动名称',
    //     fieldDecoratorOptions: {
    //       rules: [
    //         {
    //           // min: 1,
    //           required: true,
    //           message: '活动名称不能为空'
    //         },
    //         {
    //           // min: 1,
    //           max: 20,
    //           message: '最多20个字符'
    //         }
    //       ]
    //     }
    //   },
    //   /** 活动类型 */
    //   type: {
    //     type: 'select', label: '活动类型',
    //     options: [
    //       {label: '限时秒杀', value: '1'},
    //       {label: '今日拼团', value: '2'},
    //       {label: '礼包', value: '3'},
    //       {label: '激活码', value: '4'},
    //       {label: '地推专区', value: '5'},
    //       {label: '体验团长专区', value: '6'},
    //       {label: '采购专区', value: '7'}
    //     ],
    //   },
    //   name: {
    //     type: 'input', label: '活动名称',
    //     fieldDecoratorOptions: {
    //       rules: [
    //         {
    //           max: 20,
    //           message: '最多20个字符'
    //         }
    //       ]
    //     }
    //   },
    //   activeTime: {
    //     type: 'rangepicker', label: '活动时间'
    //   },
    //   userScope: {
    //     type: 'checkbox', label: '目标用户',
    //     options: [
    //       {label: '全部', value: 'all'},
    //       {label: '管理员', value: '40'},
    //       {label: '合伙人', value: '30'},
    //       {label: '区长', value: '20'},
    //       {label: '团长', value: '10'},
    //       {label: '普通用户老用户', value: '2'},
    //       {label: '普通用户新用户', value: '1'}
    //     ],
    //     fieldDecoratorOptions: {
    //       rules: [
    //         {
    //           required: true,
    //           message: '请选择目标用户'
    //         }
    //       ]
    //     }
    //   },
    //   id: {
    //     type: 'input', label: '活动编号'
    //   },
    //   discountsStatus: {
    //     type: 'select', label: '状态',
    //     options: [
    //       {label: '未开始', value: '1'},
    //       {label: '进行中', value: '2'},
    //       {label: '已结束', value: '3'},
    //       {label: '已关闭', value: '0'},
    //     ]
    //   },
    //   activityDescribe: {
    //     type: 'textarea', label: '活动说明',
    //     fieldDecoratorOptions: {
    //       rules: [
    //         {
    //           required: true,
    //           message: '活动说明不能为空'
    //         },
    //         {
    //           max: 140,
    //           message: '活动说明，最多140个字符'
    //         }
    //       ]
    //     }
    //   }
    // }
  // }
  // return defaultConfig
// }
