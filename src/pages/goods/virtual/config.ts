/*
 * @Date: 2020-05-07 19:44:40
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-07 19:51:05
 * @FilePath: /xt-crm/src/pages/goods/virtual/config.ts
 */
import { FieldsConfig } from '@/packages/common/components/form'

export const defaultConfig: FieldsConfig = {
  skuSale: {
    productId: {
      label: '商品ID',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    goodsTime: {
      label: '创建时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    optionTime: {
      label: '操作时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    interceptor: {
      label: '拦截状态',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [{
        label: '全部',
        value: ''
      }, {
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }]
    },
    rechargeType: {
      label: '充值类型',
      type: 'select',
      options: [{
        label: '手机流量',
        value: 1
      }, {
        label: '手机话费',
        value: 0
      }],
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请选择充值类型'
        }]
      }
    },
    productName: {
      label: '商品名称',
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入商品名称'
        }]
      }
    },
    status: {
      label: '上架状态',
      type: 'radio',
      fieldDecoratorOptions: {
        initialValue: 3
      },
      options: [{
        label: '上架',
        value: 1
      }, {
        label: '下架',
        value: 0
      }, {
        label: '待上架',
        value: 3
      }]
    }
  }
}