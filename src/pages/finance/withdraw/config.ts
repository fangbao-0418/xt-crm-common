import { FieldsConfig } from "@/packages/common/components/form";

export const defaultConfig: FieldsConfig = {
  withdraw: {
    transferNo: {
      label: '提现单号'
    },
    moneyAccountType: {
      label: '提现类型',
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
        label: '提现取消',
        value: -2
      }, {
        label: '提现失败',
        value: -1
      }, {
        label: '待提现',
        value: 0
      }, {
        label: '提现成功',
        value: 1    
      }, {
        label: '提现中',
        value: 2
      }]
    },
    memberMobile: {
      label: '申请人手机号'
    },
    createTime: {
      label: '申请时间',
      type: 'rangepicker'
    },
    submitTime: {
      label: '提交时间',
      type: 'rangepicker'
    },
    bankCardNo: {
      label: '银行卡号'
    },
    idCardNo: {
      label: '身份证号'
    }
  }
}