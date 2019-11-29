import { FieldsConfig } from '@/packages/common/components/form'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    lottery: {
      name: {
        label: '活动名称',
        type: 'input'
      },
      type: {
        label: '活动类型',
        type: 'select',
        options: [
          { label: '所有领域', value: '' },
          { label: '产品类', value: '1' },
          { label: '运营类', value: '2' },
          { label: '设计类', value: '3' },
          { label: '开发类', value: '4' }
        ],
        formItemProps: {
          style: {
            width: 172
          }
        }
      },
      status: {
        label: '活动名称',
        type: 'select',
        options: [
          { label: '全部', value: '' },
          { label: '未开始', value: '1' },
          { label: '新发布', value: '2' },
          { label: '进行中', value: '3' },
          { label: '已结束', value: '4' },
          { label: '已失效', value: '5' }
        ],
        formItemProps: {
          style: {
            width: 172
          }
        }
      },
      createTime: {
        type: 'rangepicker',
        label: '创建时间'
      },
      startTime: {
        type: 'rangepicker',
        label: '开始时间'        
      }
    }
  }
  return defaultConfig
}