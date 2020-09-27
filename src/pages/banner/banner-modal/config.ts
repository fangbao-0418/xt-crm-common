import { FieldsConfig } from "@/packages/common/components/form/config";
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    common: {
      title: {
        label: 'Banner名称',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: 'banner名称不能为空'
          }]
        }
      },
      bgColor: {
        label: 'banner背景颜色'
      },
      bizSource: {
        label: 'banner渠道',
        type: 'select',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: 'banner渠道不能为空'
          }]
        },
        options: [{
          label: '喜团优选',
          value: 0
        }, {
          label: '喜团好店',
          value: 20
        }]
      },
      platformArray: {
        label: '平台',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择平台'
          }]
        }
      },
      jumpUrlWap: {
        label: '跳转地址'
      },
      onlineTime: {
        label: '上线时间',
        type: 'date',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择上线时间'
          }]
        },
        controlProps: {
          showTime: true,
          style: {
            width: 200
          }
        }
      },
      offlineTime: {
        label: '下线时间',
        type: 'date',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择下线时间'
          }]
        },
        controlProps: {
          showTime: true,
          style: {
            width: 200
          }
        }
      },
      sort: {
        label: '排序',
        type: 'number',
        fieldDecoratorOptions: {
          rules: [{
            message: '请输入排序',
            required: true
          }]
        },
        controlProps: {
          style: {
            width: 200
          }
        }
      },
      memberRestrictArray: {
        label: '可见用户',
        type: 'checkbox',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请选择可见用户'
          }]
        },
        options: [{
          label: '普通用户',
          value: '1'
        }, {
          label: '店长',
          value: '2'
        }, {
          label: '高级店长',
          value: '4'
        }, {
          label: '服务商',
          value: '8'
        }, {
          label: '管理员',
          value: '16'
        }, {
          label: '公司',
          value: '32'
        }]
      },
      status: {
        label: '状态',
        type: 'radio',
        fieldDecoratorOptions: {
          initialValue: 1
        },
        options: [{
          label: '开启',
          value: 1
        }, {
          label: '关闭',
          value: 0
        }]
      },
      content: {
        label: '文案',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入文案'
            }
          ]
        },
        controlProps: {
          maxLength: 25
        }
      }
    }
  }
  return defaultConfig
}