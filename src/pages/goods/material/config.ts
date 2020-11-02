import { FieldsConfig } from '@/packages/common/components/form'

export const defaultConfig: FieldsConfig = {
  MaterialTabItem: {
    productId: {
      label: '商品ID',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    productName: {
      label: '商品名称'
    },
    authorPhone: {
      label: '手机号',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    startCreate: {
      label: '发布时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    channel: {
      label: '商品渠道',
      type: 'select',
      options: [{
        label: '全部',
        value: ''
      }, {
        label: '喜团优选',
        value: '1'
      }, {
        label: '喜团好店',
        value: '2'
      }]
    }
  }
}

export enum channels {
  喜团优选 = 1,
  喜团好店 = 2
}