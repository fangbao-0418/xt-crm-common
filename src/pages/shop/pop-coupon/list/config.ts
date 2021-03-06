import { FieldsConfig } from '@/packages/common/components/form';

export const defaultConfig: FieldsConfig = {
  coupon: {
    code: {
      label: '优惠券编号',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    name: {
      label: '优惠券名称'
    },
    storeName: {
      label: '供应商'
    },
    shopName: {
      label: '店铺名称'
    },
    bizType: {
      label: '渠道',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [{
        label: '优选',
        value: 0
      }, {
        label: '好店',
        value: 2
      }
      ]
    },
    shopCode: {
      label: '店铺编号'
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

export enum statusEnums {
  失效 = 0,
  正常 = 1,
  // 异常 = 2,
  // 售罄 = 3
}