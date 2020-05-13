import { FieldsConfig } from '@/packages/common/components/form'

export const NAME_SPACE = 'area_management'
export const defaultConfig: FieldsConfig = {
  area_management: {
    name: {
      label: '名称',
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
    id: {
      label: '序号'
    },
    areaName: {
      label: '名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    },
    areaRemark: {
      type: 'textarea',
      controlProps: {
        rows: 5
      },
      label: '说明',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    },
    areaRuleDesc: {
      type: 'textarea',
      controlProps: {
        rows: 5
      },
      label: '团长招募规则',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    },
    limitCommonNum: {
      label: '普通团长招募上限',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    },
    limitSuperiorNum: {
      label: '精英团长招募上限',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }]
      }
    },
    answerUrl: {
      label: '试题链接'
    },
    limitInstructorNum: {
      label: '指导员招募上限',
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