import * as api from './api';
const namespace = 'intercept.detail.log';
export default {
  namespace,
  state: {
    sourceData: {}
  },
  reducers: {},
  effects: dispatch => ({
    async getData(payload) {
      const result = await api.getProductListByMemberId(payload);
      const skuList = [];
      (result['records'] || []).forEach(spu => {
        (spu.skuList || []).forEach((sku, index) => {
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
        type: `${namespace}/saveDefault`,
        payload: {
          sourceData: result || {}
        }
      });
    }
  })
};
