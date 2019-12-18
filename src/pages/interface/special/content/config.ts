import { FieldsConfig } from '@/packages/common/components/form'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    specialContent: {
      floorName: {
        label: '名称'
      },
      status: {
        label: '启用状态'
      },
      modifyTime: {
        label: '操作时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      },
      operator: {
        label: '最后操作人'
      }
    }
  }
  return defaultConfig
}


export enum status {
  '停用' = 0,
  '启用' = 1
}