import { FieldsConfig } from "@/packages/common/components/form"

export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    common: {
      name: {
        label: '活动名称'
      },
      type: {
        label: '活动类型',
        type: 'select',
        options: [{
          label: '品牌会场',
          value: '1'
        }]
      },
      desc: {
        label: '活动简介',
        type: 'textarea',
        controlProps: {
          style: {
            width: 300
          },
          max: 5,
          maxLength: 150,
          placeholder: '150个字，展示在供应商后台'
        }
      },
      signUpTime: {
        label: '活动报名时间',
        type: 'rangepicker'
      },
      status: {
        label: '活动状态',
        type: 'select',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '待发布',
          value: '1'
        }, {
          label: '已发布',
          value: '2'
        }, {
          label: '报名中',
          value: '3'
        }, {
          label: '预热中',
          value: '4'
        }, {
          label: '进行中',
          value: '5'
        }, {
          label: '已结束',
          value: '6'
        }, {
          label: '已关闭',
          value: '7'
        }]
      },
      schedulingTime: {
        label: '活动排期时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      },
      no: {
        label: '活动编号'
      },
      createPerson: {
        label: '创建人'
      }
    },
    addFormConfig: {
      id: {
        label: '店铺id'
      },
      name: {
        label: '店铺名称'
      }
    },
    detailFormConfig: {
      productId: {
        label: '商品id',
        controlProps: {
          style: {
            width: 220
          }
        }
      },
      productName: {
        label: '商品名称',
        controlProps: {
          style: {
            width: 220
          }
        }
      },
      status: {
        label: '审核状态',
        type: 'select',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '待审核',
          value: '1'
        }, {
          label: '通过',
          value: '2'
        }, {
          label: '拒绝',
          value: '3'
        }],
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

export enum statusEnum {
  拒绝 = 0,
  通过 = 1,
  待审核 = 2
}