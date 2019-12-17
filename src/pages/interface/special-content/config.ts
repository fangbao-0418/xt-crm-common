import { FieldsConfig } from '@/packages/common/components/form'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    specialContent: {
      name: {
        label: '名称'
      },
      status: {
        label: '启用状态'
      },
      operateTime: {
        label: '操作时间',
        type: 'rangepicker'
      },
      lastOperator: {
        label: '最后操作人'
      }
    }
  }
  return defaultConfig
}