

const couponMap = new Map();
couponMap.set({ '0': '未开始' }, ['发券', '查看', '编辑', '结束']);
couponMap.set({ '1': '进行中' }, ['查看', '编辑', '结束']);
couponMap.set({ '2': '已结束' }, ['查看']);
export { couponMap }

console.log([...couponMap.keys()])
export const columns = [
  {
    title: '编号',
    dataIndex: 'couponCode',
    key: 'couponCode',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '领取时间',
    dataIndex: 'receiveTime',
    key: 'receiveTime',
  },
  {
    title: '优惠券价值',
    dataIndex: 'discountAmount',
    key: 'discountAmount',
  },
  {
    title: '已领取/总量',
    dataIndex: 'receiveRatio',
    key: 'receiveRatio',
  },
  {
    title: '已使用|使用率',
    dataIndex: 'usedRatio',
    key: 'usedRatio',
  },
  {
    title: '领取状态',
    dataIndex: 'receiveStatus',
    key: 'receiveStatus',
    render: (text, record, index) => {
      
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  }
]