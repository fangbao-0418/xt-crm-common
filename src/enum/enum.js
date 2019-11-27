const NONE_KEY = 9999

function Enum (obj) {
  if (Array.isArray(obj)) {
    this._array = obj
    this._json = {}
    return obj.forEach(val => {
      this._json[val.key || NONE_KEY] = val.val
    })
  }
  this._json = obj
  this._array = []
  for (let i in obj) {
    this._array.push({
      key: i,
      val: obj[i]
    })
  }
}

Enum.prototype.getValue = function (key) {
  return this._json[key || NONE_KEY]
}

Enum.prototype.getKey = function (val) {
  for (let i = 0; i < this._array.length; i++) {
    if (this._array[i].val === val) return this._array[i].key
  }
}

/**
 *  { type: '', key: '', val: '' }
 * 
 */
Enum.prototype.getArray = function (config) {
  if(typeof config !== 'object') config = {type: config};
  let array = this._array;
  if(config.type == 'all') array = [
    {key: '', val: '全部'},
    ...this._array
  ]
  if(config.key || config.val) {
    array = array.map(val => {
      const _val = {}
      _val[config.key || 'key'] = val.key
      _val[config.val || 'val'] = val.val
      return _val
    })
  }
  return array
}

Enum.prototype.getJson = function () {
  return this._json
}
export default Enum
