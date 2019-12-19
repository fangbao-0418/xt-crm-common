import { FieldsConfig } from '@/packages/common/components/form'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    specialContent: {
      id: {
        label: 'ID',
        type: 'number',
        controlProps: {
          style: {
            width: 172
          }
        }
      },
      floorName: {
        label: '名称'
      },
      status: {
        label: '启用状态',
        type: 'select',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '启用',
          value: 1
        }, {
          label: '停用',
          value: 0
        }]
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