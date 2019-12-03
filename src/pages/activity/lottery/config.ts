import { FieldsConfig } from '@/packages/common/components/form'
import { Props } from '@/packages/common/components/form/FormItem'

export const name: Props = {
  name: 'name',
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
  value: string
}
export const options: Options[] = [
  { label: '所有领域', value: '' },
  { label: '产品类', value: '1' },
  { label: '运营类', value: '2' },
  { label: '设计类', value: '3' },
  { label: '开发类', value: '4' }
]
export const type: Props = {
  name: 'type',
  label: '活动类型',
  type: 'select',
  options,
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

export const status: Props = {
  label: '状态',
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
}

export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    lottery: {
      name,
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