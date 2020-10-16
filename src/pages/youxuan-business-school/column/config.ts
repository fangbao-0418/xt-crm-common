import { FieldsConfig } from "@/packages/common/components/form";

export enum statusEnum {
  显示 = 1,
  隐藏 = 2
}

export enum platformEnum {
  喜团优选 = 1,
  喜团好店 = 2
}

export enum statusMapColorEnum {
  'green' = 1,
  'orange' = 2
}

export const defaultFormConfig: FieldsConfig = {
  common: {
    columnName: {
      label: '栏目名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入栏目名称'
        }]
      }
    },
    description: {
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