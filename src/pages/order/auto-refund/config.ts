import { FieldsConfig } from '@/packages/common/components/form'

export const queryConfig: FieldsConfig = {
  autoRefund: {
    ruleId: {
      label: '配置编号',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    status: {
      label: '启用状态',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [{
        label: '全部',
        value: ''
      }, {
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }]
    },
    // category: {
    //   label: '类目选择',
    //   type: 'select',
    //   controlProps: {
    //     style: {
    //       width: 172
    //     }
    //   },
    //   options: [{
    //     label: '全部',
    //     value: ''
    //   }, {
    //     label: '是',
    //     value: 1
    //   }, {
    //     label: '否',
    //     value: 0
    //   }]
    // },
    createTime: {
      label: '创建时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    }
  }
}

export enum StatusEnum {
  待启用 = 10,
  已启用 = 20,
  已停用 = 30
}

export enum RefundTypeEnum {
  退货退款 = 10,
  换货 = 30
}

export enum MemberTypeEnum {
  普通会员 = 0,
  团长 = 10,
  区长 = 20,
  合伙人 = 30,
  管理员 = 40,
  公司 = 50
}