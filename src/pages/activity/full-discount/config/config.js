export const queryConfig = {
  fullDiscount: {
    createTime: {
      label: '活动时间'
    },
    name: {
      label: '活动名称'
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
    },
    id: {
      type: 'input', label: '编号'
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

export const activeNameMap = {
  '1': '限时秒杀',
  '2': '今日拼团',
  '3': '礼包',
  '4': '激活码',
  '5': '地推专区',
  '6': '体验团长专区',
  '7': '采购专区',
  '8': '买赠，',
  '9': '团购',
  '10': '拼团',
  '11': '满减',
  '12': '满折',
  '15': '多件一口价'
}