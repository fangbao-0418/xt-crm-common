export const queryConfig = {
  fullDiscount: {
    createTime: {
      label: '操作时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    activeName: {
      label: '商品名称'
    },
    activeStatus: {
      label: '活动状态',
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
        label: '未开始',
        value: 0
      }, {
        label: '即将开始',
        value: 1
      }, {
        label: '进行中',
        value: 2
      }, {
        label: '即将结束',
        value: 3
      }, {
        label: '已结束',
        value: 4
      }]
    }
  }
}