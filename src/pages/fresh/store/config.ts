import { FieldsConfig } from "@/packages/common/components/form";

export const NAME_SPACE = 'store';
export const defaultConfig: FieldsConfig = {
  store: {
    shopName: {
      label: '门店名称'
    },
    status: {
      label: '店铺状态',
      type: 'select',
      options: [{
        label: '新建',
        value: 1
      }, {
        label: '上线',
        value: 1
      }, {
        label: '下线',
        value: 2    
      }]
    },
    workDate: {
      label: '营业时间',
      type: 'rangepicker'
    }
  }
}


export enum statusEnum {
  新建 = 1,
  上线 = 2,
  下线 = 3
}

export enum shopTypeEnum {
  喜团小店 = 1,
  喜团工厂店 = 2
}