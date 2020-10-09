import { FieldsConfig } from "@/packages/common/components/form/config";

export const defaultFormConfig: FieldsConfig = {
  common: {
    title: {
      label: '文章标题'
    },
    column: {
      label: '栏目',
      type: 'select',
      controlProps: {
        style: {
          width: 195
        }
      },
      options: [{
        label: '全部',
        value: ''
      }, {
        label: '新手学堂',
        value: '1'
      }, {
        label: '官方资讯',
        value: '2'
      }, {
        label: '团长进修',
        value: '3'
      }, {
        label: '销量排行',
        value: '4'
      }],
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请选择栏目'
        }]
      }
    },
    memberType: {
      label: '指定用户可见',
      type: 'radio',
      options: [{
        label: '全部用户',
        value: ''
      }, {
        label: '团长以上',
        value: '10'
      }, {
        label: '区长以上',
        value: '20'
      }, {
        label: '合伙人以上',
        value: '30'
      }]
    },
    channel: {
      label: '渠道',
      type: 'select',
      options: [{
        label: '全部',
        value: 0
      }, {
        label: '喜团优选',
        value: 10
      }, {
        label: '喜团好店',
        value: 30
      }]
    },
    share: {
      label: '支持分享'
    },
    publishTime: {
      label: '定时发布',
      type: 'date',
      controlProps: {
        showTime: true
      }
    },
    readNum: {
      label: '虚拟阅读量',
      type: 'number',
      controlProps: {
        style: {
          width: 195
        },
        min: 1
      }
    }
  }
}

export enum statusEnums {
  已发布 = 0,
  发布中 = 1,
  草稿 = 2
}

export enum columnEnums {
  新手学堂 = 1,
  官方资讯 = 2,
  团长进修 = 3,
  销量排行 = 4
}