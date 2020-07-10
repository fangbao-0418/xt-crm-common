const brandTypeList = [
  {
    key: 1,
    text: '自由品牌'
  },
  {
    key: 2,
    text: '授权品牌'
  }
]

const brandTypeListMap = brandTypeList.reduce((pre, next) => ({
  ...pre,
  [next.key]: next.text
}), {})

export {
  brandTypeList,
  brandTypeListMap
}

// 1 待审核 2 通过 3 驳回