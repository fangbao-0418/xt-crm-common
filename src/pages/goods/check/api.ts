import { post, get, newPost } from '../../../util/fetch';
const mockBaseUrl = 'http://mock-ued.hzxituan.com/mock/5dc2ac6048f0fe0016ffe499/crm';
import axios from 'axios';
export async function getGoodsCheckList(data: any) {
  const res = await axios.get(`${mockBaseUrl}/goods/checklist`)
  return res.data.data;
}
