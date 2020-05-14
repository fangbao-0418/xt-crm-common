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
        }]
      }
    },
    instructorPhone: {
      label: '指导员手机',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入名称'
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
          required: true,
          message: '请输入说明'
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
          required: true,
          message: '请输入绑定区域'
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
          required: true,
          message: '请输入责任门店'
        }]
      }
    }
  }
}