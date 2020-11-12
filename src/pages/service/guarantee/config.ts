import { FieldsConfig } from "@/packages/common/components/form";

export function getFieldsConfig () {
  const defaultConfig:FieldsConfig = {
    common: {
      name: {
        label: '服务名称',
        controlProps: {
          disabled: true
        },
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请输入服务名称'
          }]
        }
      },
      content: {
        label: '服务内容',
        type: 'textarea',
        controlProps: {
          placeholder: '请输入服务内容'
        }
      },
      sort: {
        label: '排序',
        type: 'number',
        fieldDecoratorOptions: {
          rules: [{
            required: true,
            message: '请输入排序'
          }]
        },
        controlProps: {
          style: {
            width: '100%'
          },
          placeholder: '数字越大越靠前',
          max: 100000,
          min: 0
        }
      }
    }
  }
  return defaultConfig
}