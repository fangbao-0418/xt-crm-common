import { FieldsConfig } from "@/packages/common/components/form";

export const NAME_SPACE = 'store';
export const defaultConfig: FieldsConfig = {
  store: {
    code: {
      label: '门店编码'
    },
    name: {
      label: '门店名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入门店名称'
        }]
      },
      controlProps: {
        maxLength: 30,
        placeholder: '请输入门店名称，30个字符内'
      }
    },
    type: {
      label: '门店类型',
      type: 'select',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请选择门店类型'
        }]
      },
      options: [{
        label: '喜团小店',
        value: 1
      }, {
        label: '喜团工厂店',
        value: 2
      }, {
        label: '生鲜店',
        value: 3
      }]
    },
    memberPhone: {
      label: '店主手机',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入店主手机'
        }, {
          pattern: /^1[3456789]\d{9}$/,
          message: '店主手机有误，请重填'
        }]
      }
    },
    phone: {
      label: '门店电话',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入门店电话'
        }, {
          pattern: /^1[3456789]\d{9}$/,
          message: '门店电话有误，请重填'
        }]
      }
    },
    pointDesc: {
      label: '门店简介',
      type: 'textarea',
      controlProps: {
        rows: 5
      }
    },
    status: {
      label: '店铺状态',
      type: 'select',
      options: [{
        label: '新建',
        value: 1
      }, {
        label: '上线',
        value: 2
      }, {
        label: '下线',
        value: 3    
      }]
    },
    workDate: {
      label: '创建时间',
      type: 'rangepicker'
    }
  }
}


export enum statusEnum {
  新建 = 1,
  上线 = 2,
  下线 = 3
}

export enum typeEnum {
  喜团小店 = 1,
  喜团工厂店 = 2,
  生鲜店 = 3
}