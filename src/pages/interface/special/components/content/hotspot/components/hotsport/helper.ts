/*
 * @Author: fangbao
 * @Date: 2020-04-27 00:16:34
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-27 01:01:09
 * @FilePath: /eslint-plugin-xt-react/Users/fb/Documents/xituan/xt-crm/src/pages/interface/special/components/content/hotspot/components/hotsport/helper.ts
 */

/**
 * 数值是否在范围内
 * @param {string[]} dot - 格式如[x, y]
 * @param {string[]} range - 格式如[x1, y1, x2, y2`]
 */
export function isInner (dot: number[], range: number[]) {
  const [x, y] = dot
  const [x1, y1, x2, y2] = range
  if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
    return true
  }
  return false
}

/**
 * 查找重叠坐标
 * @param {string[]} coordinates - 格式如[`${x1},${y1},${x2},${y2}`]
 */
export function findOverlapCoordinates (coordinates: string[]) {
  let res: any
  coordinates.map((item, index) => {
    const [x1, y1, x2, y2] = item.split(',').map((val) => +val)
    coordinates.map((item2, index2) => {
      const scope = item2.split(',').map((val) => +val)
      const arr = [[x1, y1], [x2, y1], [x1, y2], [x2, y2]]
      if (index !== index2) {
        // 存在重叠元素
        if (arr.find((item3) => isInner(item3, scope))) {
          if (!res) {
            res = {}
          }
          if (!res[index]) {
            res[index] = []
          }
          res[index].push(index2)
        }
      }
    })
  })
  return res
}