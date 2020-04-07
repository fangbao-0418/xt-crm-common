export const queryConfig = {
  fullDiscount: {
    createTime: {
      label: '活动时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    title: {
      label: '商品名称'
    },
    discountsStatus: {
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
        value: 1
      }, {
        label: '进行中',
        value: 2
      }, {
        label: '已结束',
        value: 3
      }, {
        label: '已关闭',
        value: 0
      }]
    }
  }
}

export const discountsStatusList = [{
  id: '1',
  text: '未开始'
}, {
  id: '2',
  text: '进行中'
}, {
  id: '3',
  text: '已结束'
}, {
  id: '0',
  text: '已关闭'
}]

export const discountsStatusMap = discountsStatusList.reduce((pre, next) => {
  return {
    ...pre,
    [next.id]: next.text
  }
}, {})