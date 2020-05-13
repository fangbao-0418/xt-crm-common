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
  启用中 = 20,
  已废弃 = 30
}