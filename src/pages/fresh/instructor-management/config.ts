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
    id: {
      label: '序号'
    },
    instructorName: {
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
    instructorPhone: {
      label: '指导员手机',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
        }, {
          max: 11,
          message: '长度最大11个字符'
        }, {
          pattern: /^[0-9]+$/,
          message: '只能输入数字'
        }]
      }
    },
    instructorRemark: {
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
    selfPointAreaIds: {
      type: 'textarea',
      controlProps: {
        rows: 5
      },
      label: '绑定区域',
      fieldDecoratorOptions: {
        rules: [{
          pattern: /^[0-9,]+$/,
          message: '只能输入数字和英文逗号'
        }, {
          max: 500,
          message: '长度最大500个字符'
        }]
      }
    },
    selfPointIds: {
      type: 'textarea',
      controlProps: {
        rows: 5
      },
      label: '责任门店',
      fieldDecoratorOptions: {
        rules: [{
          pattern: /^[0-9,]+$/,
          message: '只能输入数字和英文逗号'
        }]
      }
    }
  }
}