import { FieldsConfig } from '@/packages/common/components/form';

export const defaultConfig: FieldsConfig = {
  couponFresh: {
    code: {
      label: '优惠券编号',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    name: {
      label: '优惠券名称'
    },
    status: {
      label: '状态',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [{
        label: '未开始',
        value: 0
      }, {
        label: '进行中',
        value: 1
      }, {
        label: '已结束',
        value: 2
      }
      ]
    }
  }
}
