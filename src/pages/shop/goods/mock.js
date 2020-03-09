/**
 * 查询小店商品列表
 * 缺少售价, 缺少主图 sku图, 缺少一级以下全部类目
*/
export const list = {
  code: '00000',
  message: "成功",
  success: true,
  data: {
    records: [
      {
        id: 0,
        coverUrl: 'https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551575374574614.jpg',
        productName: '商品名称',
        firstCategoryId: 0,
        firstCategoryName: '一级类目名称',
        storeId: 0,
        supplierName: '供应商名称',
        childStatus: 1,
        auditTime: '2020-03-09 15:40',
        auditUser: '审核人',
        violationCount: 10
      }
    ],
    total: 947,
    size: 10,
    current: 1,
    searchCount: true,
    pages: 95
  }
}

/**
 * 审核商品通过和不通过
*/
export const audit = {
  code: '00000',
  message: "成功",
  success: true
}

/**
 * 下架商品
*/
export const disable = {
  code: '00000',
  message: "成功",
  success: true
}