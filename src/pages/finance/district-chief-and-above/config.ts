import { FieldsConfig } from '@/packages/common/components/form'

export const getDefaultConfig = () => {
  const defaultConfig: FieldsConfig = {
    common: {
      outTransferNo: {
        label: '申请单编号'
      },
      memberId: {
        label: '会员ID'
      },
      memberPhone: {
        label: '会员手机号'
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
  待提现 = -31,
  提现失败 = -1,
  提现中 = 0,
  提现成功 = 1
}