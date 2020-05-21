import { FieldsConfig } from '@/packages/common/components/form'

export const queryConfig: FieldsConfig = {
  autoRefund: {
    serialNo: {
      label: '配置编号',
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
        label: '已启用',
        value: 20
      }, {
        label: '已停用',
        value: 30
      }, {
        label: '待启用',
        value: 10
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
  已停用 = 30,
  已删除 = 40
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