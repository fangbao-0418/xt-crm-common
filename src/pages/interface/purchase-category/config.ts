import { FieldsConfig } from '@/packages/common/components/form'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    groupBuyingCategory: {
      name: {
        type: 'input',
        label: '团购会分类名称',
        fieldDecoratorOptions: {
          rules: [{
            required: true
          }]
        },
        controlProps: {
          style: {
            width: 172
          }
        }
      },
      sort: {
        type: 'input',
        label: '排序',
        fieldDecoratorOptions: {
          rules: [{
            required: true
          }]
        },
        controlProps: {
          style: {
            width: 172
          }
        }
      },
      display: {
        label: '是否显示'
      }
    } 
  }
  return defaultConfig
}