import { FieldsConfig } from "@/packages/common/components/form";

export enum statusEnum {
  显示 = 0,
  隐藏 = 1
}

export enum channelEnum {
  喜团优选 = 10,
  喜团好店 = 30
}

export enum statusMapColorEnum {
  'green' = 0,
  'orange' = 1
}

export const defaultFormConfig: FieldsConfig = {
  common: {
    name: {
      label: '栏目名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入栏目名称'
        }]
      }
    },
    desc: {
      label: '描述',
      type: 'textarea',
      controlProps: {
        placeholder: '栏目含义，栏目文章标准'
      }
    },
    sort: {
      label: '排序',
      type: 'number',
      controlProps: {
        placeholder: '请输入序号',
        min: 0,
        max: 100000,
        style: {
          width: '100%'
        }
      }
    }
  }
}

export const formLayoutConfig = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 12
  }
}