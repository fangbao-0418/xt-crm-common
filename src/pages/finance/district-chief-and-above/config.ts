import { FieldsConfig } from '@/packages/common/components/form'

export const getDefaultConfig = () => {
  const defaultConfig: FieldsConfig = {
    common: {
      id: {
        label: '申请单编号'
      },
      memberId: {
        label: '会员',
        controlProps: {
          placeholder: '请输入会员名称'
        }
      },
      memberType: {
        label: '会员等级',
        type: 'select',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '区长',
          value: 20
        }, {
          label: '合伙人',
          value: 30
        }, {
          label: '管理员',
          value: 40
        }]
      },
      createTime: {
        label: '申请时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return defaultConfig
}

export enum statusEnums {
  提现失败 = -1,
  提现中 = 0,
  提现成功 = 1
}