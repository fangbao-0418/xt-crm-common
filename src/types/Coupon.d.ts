declare module Coupon {
  export interface CouponItemProps {
    id:               number;
    code:             string;
    name:             string;
    inventory:        number;
    receiveCount:     number;
    useCount:         number;
    description:      string;
    remark:           string;
    status:           number;
    startReceiveTime: number;
    overReceiveTime:  number;
    faceValue:        string;
    isDelete:         number;
    sort:             number;
  }
}


