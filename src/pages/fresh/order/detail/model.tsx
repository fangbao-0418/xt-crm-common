import { queryOrderDetail } from '../api'
export const namespace = 'fresh.order.detail'

export default {
  namespace,
  state: {
    data: {},
    childOrderList: []
  },
  reducers: {
    '@@init': () => {
      return {
        data: {},
        childOrderList: []
      }
    }
  },
  effects: {
    async fetchDetail (payload: {orderCode: number}) {
      const data = await queryOrderDetail(payload) || {}
      const childOrderMap: any = {};
      (data.orderInfo && data.orderInfo.childOrderList || []).forEach((item: any) => {
        childOrderMap[item.id] = {
          childOrder: item,
          logistics: item,
          skuList: item.skuList,
        };
      });
      (data.logisticsList || []).forEach((item: any)  => {
        const id = Number(item.childOrderId);
        childOrderMap[id] && (childOrderMap[id].logistics = item);
      });
      (data.skuList || []).forEach((item: any)  => {
        const id = Number(item.childOrderId);
        childOrderMap[id] && childOrderMap[id].skuList && childOrderMap[id].skuList.push(item);
      });
      (this as any).saveDefault({
        data,
        childOrderList: Object.values(childOrderMap)
      })
    }
  }
}