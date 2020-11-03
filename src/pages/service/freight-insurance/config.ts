import { FieldsConfig } from "@/packages/common/components/form/config";
export const formConfig: FieldsConfig = {

  common: {
    orderCode: {
      label: '订单号'
    },
    thirdInsuranceSn: {
      label: '保单号'
    },
    insuranceTime: {
      label: '起止时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    insuranceStatus: {
      label: '运费险状态',
      type: 'select',
      options: [{
        label: '未生效',
        value: 5
      }, {
        label: '保障中',
        value: 10
      }, {
        label: '理赔成功',
        value: 15
      }, {
        label: '理赔失败',
        value: 20
      }, {
        label: '取消',
        value: 25
      }]
    }
  }
}
