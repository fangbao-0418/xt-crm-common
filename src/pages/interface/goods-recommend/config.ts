import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: { [field: string]: OptionProps }
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      name: {
        type: 'input',
        label: '名称',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入名称'
            },
            {
              max: 40,
              message: '名称40个字符，支持中英文数字'
            }
          ]
        }
      },
      date: {
        type: 'rangepicker',
        label: '时间',
        controlProps: {
          showTime: true
        },
        fieldDecoratorOptions: {
          rules: [
            {
              validator: (rule, value, cb) => {
                console.log(value, '-=----')
                if (!value) {
                  cb('请选择开始/结束时间')
                } else if (!value[0]) {
                  cb('请选择开始时间')
                } else if (!value[1]) {
                  cb('请选择结束时间')
                } else if (value[1].unix() * 1000 < new Date().getTime()) {
                  cb('结束时间不能小于当前时间')
                }
                cb()
              }
            }
          ]
        }
      },
      /** 位置 */
      location: {
        type: 'select',
        label: '位置',
        allValue: 0,
        options: [
          { label: '全部', value: 0 },
          { label: '支付结果页', value: 8 },
          { label: '个人中心', value: 4 },
          { label: '购物车', value: 2 },
          { label: '商品详情', value: 1 },
          { label: '拼团详情', value: 16 },
          { label: '升级团长页', value: 32 }
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '位置不能为空'
            }
          ]
        }
      },
      displayFrom: {
        type: 'checkbox',
        label: '展示端',
        allValue: 0,
        options: [
          { label: '全部', value: 0 },
          { label: 'ios', value: 8 },
          { label: '安卓', value: 4 },
          { label: '小程序', value: 2 },
          { label: 'H5', value: 1 }
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '展示端不能为空'
            }
          ]
        }
      },
      status: {
        type: 'select',
        label: '状态',
        options: [
          { label: '已失效', value: 0 },
          { label: '待生效', value: 1 },
          { label: '已生效', value: 2 }
        ]
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}

export enum StatusEnum {
  已失效 = 0,
  待生效 = 1,
  已生效 = 2
}

export enum LocationEnum {
  升级团长页 = 32,
  拼团详情 = 16,
  支付结果页 = 8,
  个人中心 = 4,
  购物车 = 2,
  商品详情 = 1
}

export enum DisplayFromEnum {
  ios = 8,
  安卓 = 4,
  小程序 = 2,
  H5 = 1
}

export const locationMap: any = {
  value: getAllGroupMap([1, 2, 4, 8, 16, 32]),
  get label () {
    const value = this.value
    const result: any = {}
    for (let key in value) {
      const arr: string[] = []
      value[key].map((item: number) => {
        if (item !== 0) {
          arr.push(LocationEnum[item])
        }
      })
      result[key] = arr.join(',')
    }
    return result
  }
}

export function getAllGroup (arg: number[]) {
  const result: number[][] = []
  function loop (arr: number[], floor = 0, temp: number[] = []) {
    const max = arr.length
    floor++
    arr.map((item) => {
      temp.push(item)
      let existNum = 0
      if (floor === 1) {
        temp = [item]
      } else {
        let tempObj: any = {}
        temp.map((item2) => {
          if (tempObj[item2]) {
            existNum++
          } else {
            tempObj[item2] = true
          }
          return item2
        })
      }
      if (existNum === 0) {
        result.push(temp)
      }
      if (max < floor + 1) {
        // result.push(temp)
      } else {
        // result.push(temp)
        loop(arr, floor, [...temp])
      }
      temp = temp.slice(0, -1)
      return item
    })
  }
  loop(arg)
  return result
}
function getAllGroupMap (arr: number[]) {
  const reusltArr = getAllGroup(arr)
  let result: any = {}
  reusltArr.map((item) => {
    const key = item.reduce((a, b) => a + b)
    if (item.length === arr.length) {
      item.unshift(0)
    }
    result[key] = item
  })
  console.log(result, 'result')
  return result
}
export const displayFromMap: any = {
  value: getAllGroupMap([1, 2, 4, 8]),
  get label () {
    const value = this.value
    const result: any = {}
    for (let key in value) {
      const arr: string[] = []
      value[key].map((item: number) => {
        if (item !== 0) {
          arr.push(DisplayFromEnum[item])
        }
      })
      result[key] = arr.join(',')
    }
    return result
  }
}