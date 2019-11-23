import * as api from './api';

export default {
  namespace: 'intercept.detail.stock',
  state: {
    sourceData: {}
  },
  reducers: {
    updateSkuList(prev, data) {
      const currentRecord = prev.sourceData.records.find(item => item.skuId === data.skuId);
      currentRecord.skuInventory = data.skuInventory;
      return { sourceData: Object.assign({}, prev.sourceData) };
    }
  },
  effects: dispatch => ({
    async getData(payload) {
      const result = await api.getProductListByMemberId(payload);
      const skuList = [];
      result['records'].map(spu => {
        (spu.skuList || []).map((sku, index) => {
          skuList.push({
            index,
            id: sku.id,
            spuId: spu.productId,
            spuName: spu.productName,
            skuCount: spu.skuList.length,
            status: spu.status,
            skuId: sku.skuId,
            skuName: sku.properties,
            skuProperties: sku.properties,
            skuInventory: sku.inventory
          });
        });
      });
      result.records = skuList;
      dispatch({
        type: 'intercept.detail.stock/saveDefault',
        payload: {
          sourceData: result || {}
        }
      });
    },
    async changeStockBySKUId(payload) {
      const result = await api.changeStockBySKUId(payload);
      return result;
    }
  })
};
