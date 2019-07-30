/* eslint-disable no-undef */
import { forEach, isNil } from 'lodash';

export default function descartes() {
  const $1 = isNil(arguments[0]) ? [] : arguments[0];
  if ($1.length < 2 && $1.length > 0) return $1[0].data || [];

  return [].reduce.call($1, function(col, set) {
    var res = [];
    forEach(col.data, function(c) {
      forEach(set.data, function(s) {
        var t = [].concat(Array.isArray(c) ? c : [c]);
        t.push(s);
        res.push(t);
      });
    });
    return res;
  });
}
