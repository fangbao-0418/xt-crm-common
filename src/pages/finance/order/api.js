import * as Fetch from '@/util/fetch';
export function exportFile(data) {
  return Fetch.exportFile('/order/orderReport/export', data);
}
/**
 * 
import * as Fetch from '@/util/fetch';
import {baseHost} from '@/util/baseHost';
import { formatData } from '@/util/utils';
export function exportFile(data) {
  window.open(baseHost + '/order/orderReport/export?' + formatData(data));
  // return Fetch.exportFile(, data);
} 

 */