import { OptionProps } from '@/packages/common/components/form/index'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}

export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      supplierId: {
        type: 'input',
        label: '供应商ID',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '供应商ID不能为空'
            }
          ]
        }
      },
      goodsId: {
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
              required: true,
              message: '商品ID不能为空'
            }
          ]
        }
      },
      phones: {
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
                  cb('请添加准确的手机号~')
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