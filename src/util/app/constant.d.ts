interface Options {
  label: string;
  value: string;
}

interface constantProps {
  // 物流公司
  expressList: Options[];
  // 物流公司code到name映射
  expressConfig: any;
  // 订单类型
  orderTypeList: Options[];
  // 订单类型映射
  orderTypeConfig: any;
}