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

Enum.prototype.getArray = function (type) {
  if(type == 'all') return [
    {key: '', val: '全部'},
    ...this._array
  ]
  return this._array
}

Enum.prototype.getJson = function () {
  return this._json
}
export default Enum
