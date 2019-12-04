import { FieldsConfig } from '@/packages/common/components/form'
import { Props } from '@/packages/common/components/form/FormItem'

export const title: Props = {
  name: 'title',
  label: '活动名称',
  type: 'input',
  fieldDecoratorOptions: {
    rules: [{
      required: true,
      message: '请输入活动名称'
    }]
  },
  formItemProps: {
    style: {
      width: 172
    }
  }
}
interface Options {
  label: string
  value: string | number | null
}
export const type: Props = {
  name: 'type',
  label: '活动类型',
  type: 'select',
  options: [
    { label: '全部', value: null },
    { label: '红包雨', value: 1 },
    { label: '九宫格抽奖', value: 2 }
  ],
  fieldDecoratorOptions: {
    rules: [{
      required: true,
      message: '请选择活动类型'
    }]
  },
  formItemProps: {
    style: {
      width: 172
    }
  }
}

export const prizeOptions: Options[] = [
  { label: '现金', value: '1' },
  { label: '优惠券', value: '2' },
  { label: '实物', value: '3' },
  { label: '元宝', value: '4' }
]

/** 抽奖活动状态 */
export const statusOptions: Options[] = [
  { label: '全部', value: null },
  { label: '未开始', value: 0 },
  { label: '进行中', value: 1 },
  { label: '已结束', value: 2 },
  { label: '已关闭', value: 3 }
]

/**
 * { label: string, value: number | string | null } [] => { [prop: string]: string } 
 * @param options 
 */
export function convert (options: Options[]) {
  return options.reduce((prev: any, curr: Options) => {
    curr.value = curr.value || ''
    prev[curr.value] = curr.label
    return prev
  }, {})
}

export const statusConfig = convert(statusOptions)
export const status: Props = {
  label: '状态',
  type: 'select',
  options: statusOptions,
  formItemProps: {
    style: {
      width: 172
    }
  }
}

export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    lottery: {
      title,
      type,
      status,
      createTime: {
        type: 'rangepicker',
        label: '创建时间'
      },
      beginTime: {
        type: 'rangepicker',
        label: '开始时间'        
      }
    }
  }
  return defaultConfig
}