import { FieldsConfig } from "@/packages/common/components/form"

export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    common: {
      title: {
        label: '活动名称',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请输入活动名称'
          }]
        },
        controlProps: {
          maxLength: 30
        }
      },
      type: {
        label: '活动类型',
        type: 'select',
        options: [{
          label: '品牌会场',
          value: 60
        }],
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择活动类型'
          }]
        }
      },
      description: {
        label: '活动简介',
        type: 'textarea',
        controlProps: {
          style: {
            width: 300
          },
          max: 5,
          maxLength: 150,
          placeholder: '150个字，展示在供应商后台'
        },
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请输入活动简介'
          }]
        }
      },
      applyTime: {
        label: '活动报名时间',
        type: 'rangepicker',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择活动报名时间'
          }]
        },
        controlProps: {
          showTime: true
        }
      },
      status: {
        label: '活动状态',
        type: 'select',
        options: [{
          label: '全部',
          value: 0
        }, {
          label: '待发布',
          value: 1
        }, {
          label: '已发布',
          value: 2
        }, {
          label: '报名中',
          value: 3
        }, {
          label: '预热中',
          value: 4
        }, {
          label: '进行中',
          value: 5
        }, {
          label: '已结束',
          value: 6
        }, {
          label: '已关闭',
          value: 7
        }, {
          label: '未开始',
          value: 8
        }]
      },
      preheatTime: {
        label: '线上预热时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        },
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择活动排期时间'
          }]
        }
      },
      activityTime: {
        label: '活动排期时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        },
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择活动排期时间'
          }]
        }
      },
      promotionId: {
        label: '活动编号'
      },
      operator: {
        label: '创建人'
      },
      productName: {
        label: '商品名称'
      },
      productId: {
        label: '商品ID',
        type: 'number',
        controlProps: {
          style: {
            width: 172
          }
        }
      },
      name: {
        label: '会场名称',
        type: 'text'
      },
      tags: {
        label: '会场标签',
        type: 'text'
      },
      venueDescription: {
        label: '会场介绍',
        type: 'text'
      }
    },
    addFormConfig: {
      shopId: {
        label: '店铺id'
      },
      shopName: {
        label: '店铺名称'
      }
    },
    detailFormConfig: {
      productId: {
        label: '商品id',
        controlProps: {
          style: {
            width: 220
          },
          maxLength: 20
        }
      },
      productName: {
        label: '商品名称',
        controlProps: {
          style: {
            width: 220
          }
        }
      }
    }
  }
  return defaultConfig
}

export const statusArray = [{
  label: '全部',
  value: 0
}, {
  label: '待发布',
  value: 1
}, {
  label: '已发布',
  value: 2
}, {
  label: '报名中',
  value: 3
}, {
  label: '未开始',
  value: 8
}, {
  label: '预热中',
  value: 4
}, {
  label: '进行中',
  value: 5
}, {
  label: '已结束',
  value: 6
}, {
  label: '已关闭',
  value: 7
}]

/**
 * 活动状态枚举
 * 0-全部/1-待发布/2-已发布/3-报名中/4-预热中/5-进行中/6-已结束/7-已关闭/8-未开始
 */
export enum promotionStatusEnum {
  全部 = 0,
  待发布 = 1,
  已发布 = 2,
  报名中 = 3,
  预热中 = 4,
  进行中 = 5,
  已结束 = 6,
  已关闭 = 7,
  未开始 = 8
}

export enum statusEnum {
  待审核 = 0,
  审核通过 = 1,
  审核拒绝 = 2,
}