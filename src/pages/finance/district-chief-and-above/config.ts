import { FieldsConfig } from '@/packages/common/components/form'

export const getDefaultConfig = () => {
  const defaultConfig: FieldsConfig = {
    common: {
      no: {
        label: '申请单编号'
      },
      memberId: {
        label: '会员',
        controlProps: {
          placeholder: '请输入会员名称'
        }
      },
      grade: {
        label: '会员等级',
        type: 'select',
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '区长',
          value: '1'
        }, {
          label: '合伙人',
          value: '2'
        }, {
          label: '管理员',
          value: '3'
        }]
      },
      time: {
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
  待提现 = 1,
  提现成功 = 2,
  提现失败 = 3,
  提现中 = 4
}