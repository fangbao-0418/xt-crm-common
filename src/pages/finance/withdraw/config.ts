import { FieldsConfig } from "@/packages/common/components/form";

export const NAME_SPACE = 'withdraw'
export const defaultConfig: FieldsConfig = {
  withdraw: {
    batchId: {
      label: '批次ID',
      controlProps: {
        style: {
          width: 200
        }
      }
    },
    transferNo: {
      label: '提现单号',
      controlProps: {
        style: {
          width: 200
        }
      }
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
    },
    idCardAddress: {
      label: '持卡人身份证地址'
    },
    moneyAccountTypeDesc: {
      label: '提现类型'
    },
    transferAmount: {
      label: '提现金额'
    },
    serviceCharge: {
      label: '服务费'
    },
    transferStatusDesc: {
      label: '提现状态'
    },
    realName: {
      label: '银行卡持有人'
    },
    phone: {
      label: '持卡人预留手机号'
    }
  }
}