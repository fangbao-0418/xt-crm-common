import { OptionProps } from '@/packages/common/components/form/index'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}

export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      storeId: {
        type: 'number',
        label: '供应商ID',
        controlProps: {
          style: {
            width: '100%'
          }
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '供应商ID不能为空'
            }
          ]
        }
      },
      productIds: {
        type: 'textarea',
        label: '商品ID',
        controlProps: {
          autoSize: {
            minRows: 4
          },
          placeholder: '请输入商品ID, 以英文状态逗号隔开'
        },
        fieldDecoratorOptions: {
          rules: [
            {
              validator: (rule, value, cb) => {
                const reg = /^\d+(,\d+)*$/
                if (!reg.test(value)) {
                  cb('请添加准确的商品ID')
                  // return
                } else {
                  cb()
                }
              }
            }
          ]
        }
      },
      memberPhones: {
        type: 'textarea',
        label: '下单手机号',
        controlProps: {
          autoSize: {
            minRows: 6
          },
          placeholder: '请输入下单人手机号, 以英文状态逗号隔开'
        },
        fieldDecoratorOptions: {
          rules: [
            {
              validator: (rule, value, cb) => {
                const reg = /^[1]([0-9])[0-9]{9}(,[1]([0-9])[0-9]{9})*$/
                if (!reg.test(value)) {
                  cb('请添加准确的手机号')
                  // return
                } else {
                  cb()
                }
              }
            }
          ]
        }
      }
    }
  }

  return defaultConfig
}