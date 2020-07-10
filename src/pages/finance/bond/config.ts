import { FieldsConfig } from '@/packages/common/components/form'
export const NAME_SPACE = 'withdraw'
export const defaultConfig: FieldsConfig = {
  withdraw: {
    transferNo: {
      label: '商家名称',
      controlProps: {
        style: {
          width: 200
        }
      }
    },
    moneyAccountType: {
      label: '业务类型',
      type: 'select',
      options: [{
        label: '普通提现',
        value: 0
      }, {
        label: '拦截提现',
        value: 1
      }]
    },
    transferStatus: {
      label: '状态',
      type: 'select',
      options: [{
        label: '新发布',
        value: -2
      }, {
        label: '已缴纳',
        value: -1
      }]
    },
    createTime: {
      label: '设置时间',
      type: 'rangepicker'
    }
  }
}