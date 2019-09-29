declare module ApplyOrderSkuDetail {
  export interface data {
    skuId: number;
    orderId: number;
    childOrderId: number;
    productId: number;
    productName: string;
    productImage: string;
    properties: string;
    quantity: number;
    dealPrice: number;
    dealTotalPrice: number;
    preferentialTotalPrice: number;
    amount: number;
    unitPrice: number;
    serverNum: number;
    returnContact: string;
    returnPhone: string;
    provinceId: number;
    province: string;
    cityId: number;
    city: string;
    districtId: number;
    district: string;
    street: string;
  }
}
