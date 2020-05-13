import { FieldsConfig } from '@/packages/common/components/form'

export const NAME_SPACE = 'area_management'
export const defaultConfig: FieldsConfig = {
  area_management: {
    phone: {
      label: '手机号',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    }
  }
}

export const defaultConfigForm: FieldsConfig = {
  area_management: {
    code: {
      label: '序号'
    },
    name: {
      label: '名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    },
    remark: {
      type: 'textarea',
      controlProps: {
        rows: 5
      },
      label: '说明',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入说明'
        }]
      }
    },
    rule: {
      type: 'textarea',
      controlProps: {
        rows: 5
      },
      label: '绑定区域',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入绑定区域'
        }]
      }
    },
    rule1: {
      type: 'textarea',
      controlProps: {
        rows: 5
      },
      label: '责任门店',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入责任门店'
        }]
      }
    },
    inviteShopName: {
      label: '指导员手机',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    }
  }
}
export enum statusEnums {
  失效 = 0,
  正常 = 1,
  // 异常 = 2,
  // 售罄 = 3
}