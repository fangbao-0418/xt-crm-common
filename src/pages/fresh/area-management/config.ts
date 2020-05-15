/* eslint-disable no-dupe-keys */
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
        }, {
          max: 20,
          message: '长度最大20个字符'
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
          max: 500,
          message: '长度最大500个字符'
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
          message: '请输入团长招募规则'
        }, {
          max: 500,
          message: '长度最大500个字符'
        }]
      }
    },
    limitCommonNum: {
      label: '普通团长招募上限',
      type: 'number',
      controlProps: {
        precision: 0,
        min: 0,
        max: 999999,
        style: { width: '100%' }
      },
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入普通团长招募上限'
        }]
      }
    },
    limitSuperiorNum: {
      label: '精英团长招募上限',
      type: 'number',
      controlProps: {
        precision: 0,
        min: 0,
        max: 999999,
        style: { width: '100%' }
      },
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入精英团长招募上限'
        }]
      }
    },
    answerUrl: {
      label: '试题链接',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入试题链接'
        }]
      }
    },
    limitInstructorNum: {
      label: '指导员招募上限',
      type: 'number',
      controlProps: {
        precision: 0,
        min: 0,
        max: 999999,
        style: { width: '100%' }
      },
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入指导员招募上限'
        }]
      }
    }
  }
}