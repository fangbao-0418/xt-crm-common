import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      id: {
        type: 'input', label: '模板ID',
        controlProps: {
          type: 'number'
        }
      },
      type: {
        type: 'select', label: '模板类型',
        options: [
          {label: '短信', value: '0'},
          {label: 'PUSH', value: '2'},
          {label: '站内信', value: '3'},
          {label: '服务号', value: '4'},
          {label: '小程序', value: '5'}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择模板类型'
            }
          ]
        }
      },
      status: {
        type: 'select', label: '状态',
        options: [
          {label: '已启用', value: '0'},
          {label: '已禁用', value: '1'}
        ] 
      },
      createTime: {
        type: 'rangepicker', label: '发送时间',
        controlProps: {
          showTime: true
        }
      },
      messageGroup: {
        type: 'select', label: '模板分类',
        options: [
          {label: '交易信息', value: '0'},
          {label: '团队收益', value: '1'},
          {label: '活动消息', value: '2'},
          {label: '系统通知', value: '3'}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择模板分类'
            }
          ]
        }
      },
      businessGroup: {
        type: 'input', label: '模板编码',
        controlProps: {
          placeholder: '请输入模板唯一识别编号名称，20个字符'
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '模板唯一识别编号不能为空'
            },
            {
              max: 20,
              message: '模板唯一识别编号最大20个字符'
            }
          ]
        }
      },
      templateTitle: {
        type: 'input', label: '模板标题',
        controlProps: {
          placeholder: '请输入模板名称，40个字符'
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '模板名称不能为空'
            },
            {
              max: 40,
              message: '标题最大40个字符'
            }
          ]
        }
      },
      templateContent: {
        type: 'textarea', label: '模板内容',
        controlProps: {
          placeholder: '请输入模板内容，如果为短信、服务号、小程序模板，请与服务商模板保持一致'
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '模板内容不能为空'
            }
          ]
        }
      },
      jumpUrl: {
        type: 'input', label: '跳转URL',
        controlProps: {
          placeholder: '请输入需要跳转的页面链接'
        }
      }
    }
  }
  return defaultConfig
}

export const memberOptions = [
  {
    label: '全部',
    value: 'all'
  },
  {
    label: '普通会员',
    value: '1'
  },
  {
    label: '团长',
    value: '2'
  },
  {
    label: '社区管理员',
    value: '3'
  },
  {
    label: '城市合伙人',
    value: '4'
  },
]