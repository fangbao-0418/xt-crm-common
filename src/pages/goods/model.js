import { delGoodsDisable } from './api'
import { Modal } from 'antd'
export const namespace = 'goods'
export default {
  namespace,
  state: {},
  effects: {
    /**
     * 推送至仓库中
     * @param {*} param0 
     */
    pushWarehouse({id, cb}) {
      Modal.confirm({
        title: '系统提示',
        content: '确认将商品推至仓库中？',
        onOk: () => {
          delGoodsDisable({ ids: [id] }).then(cb);
        },
      });
    }
  }
}