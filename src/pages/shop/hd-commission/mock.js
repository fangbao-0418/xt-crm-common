/**
 * 获取类目列表
 */
export const list = {
  code: '00000',
  message: "成功",
  success: true,
  data: [{
    agencyRate: 60,
    categoryId: 1,
    companyRate: 50,
    id: 1,
    level: 1,
    name: '地推专区',
    parentCategoryId: 0,
    parentName: '',
    rateType: 1
  }]
}

/**
 * 获取详情
 */
export const detail = {
  code: '00000',
  message: "成功",
  success: true,
  data: {
    agencyRate: 60,
    companyRate: 50,
    id: 1,
    name: '地推专区',
    parentAgencyRate: 50,
    parentCategoryName: 'xx专区',
    parentCompanyRate: 20
  }
}

/**
 * 修改类目
 */
export const update = {
  code: '00000',
  message: "成功",
  success: true
}