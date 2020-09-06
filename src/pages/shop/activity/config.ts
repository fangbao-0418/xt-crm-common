import { FieldsConfig } from "@/packages/common/components/form"

export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    common: {
      name: {
        label: '活动名称'
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
    }
  }
  return defaultConfig
}