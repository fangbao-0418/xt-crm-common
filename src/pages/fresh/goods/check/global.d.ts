namespace GoodsCheck {
  export interface ItemProps {
    auditStatus: number,
    auditTime: number,
    auditUser: string,
    coverUrl: string,
    createTime: number,
    firstCategoryId: number,
    firstCategoryName: string,
    id: number,
    productName: string,
    stock: number,
    supplierName: string,
    supplyPrice: number
  }
  export interface payloadProps {
    pageSize: number,
    page: number,
    total: number
  }
}
