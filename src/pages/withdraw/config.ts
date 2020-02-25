import { FieldsConfig } from "@/packages/common/components/form";

export const defaultConfig: FieldsConfig = {
  withdraw: {
    num: {
      label: '提现单号'
    },
    type: {
      label: '提现类型',
      type: 'select',
      options: []
    },
    status: {
      label: '状态',
      type: 'select',
      options: []
    },
    account: {
      label: '申请人手机号'
    },
    applayTime: {
      label: '申请时间',
      type: 'rangepicker'
    },
    submitTime: {
      label: '提交时间',
      type: 'rangepicker'
    },
    bankCardNum: {
      label: '银行卡号'
    },
    
  }
}