import { FieldsConfig } from "@/packages/common/components/form/config";

export const defaultFormConfig: FieldsConfig = {
  common: {
    title: {
      label: '文章标题'
    },
    memberLimit: {
      label: '指定用户可见',
      type: 'radio',
      options: [{
        label: '全部用户',
        value: 0
      }, {
        label: '正式店长以上',
        value: 10
      }, {
        label: '高级店长以上',
        value: 20
      }, {
        label: '服务商',
        value: 30
      }],
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请选择指定用户可见'
        }]
      }
    },
    contextType: {
      type: 'radio',
      options: [{
        label: '富文本',
        value: '1'
      }, {
        label: '链接',
        value: '2'
      }],
      fieldDecoratorOptions: {
        initialValue: '1'
      }
    },
    releaseTime: {
      label: '定时发布',
      type: 'date',
      controlProps: {
        showTime: true
      }
    },
    virtualRead: {
      label: '虚拟阅读量',
      type: 'number',
      controlProps: {
        style: {
          width: 195
        },
        min: 0
      }
    }
  }
}

export enum statusEnums {
  草稿 = 10,
  音视频处理 = 20,
  待发布 = 30,
  已发布 = 40,
  已下架 = 50
}

export enum columnEnums {
  新手学堂 = 1,
  官方资讯 = 2,
  团长进修 = 3,
  销量排行 = 4
}