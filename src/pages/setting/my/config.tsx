import { FieldsConfig } from '@/packages/common/components/form'
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    icon: {
      iconName: {
        type: 'input',
        label: 'icon名称'
      },
      iconUrl: {
        label: '上传地址',
        formItemProps: {
        }
      },
      sort: {
        type: 'input', label: '上传地址'
      }
    }
  }
  return defaultConfig
}