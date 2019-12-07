import { FormComponentProps } from 'antd/es/form';
import { RouteComponentProps } from 'react-router';
export interface templateColumns {
  templateName: string;
  commonCost: number;
  destinationList: any[];
  createTime: number;
  modifyTime: number;
}

export interface State {
  visible: boolean;
  templateData: any[];
  destinationList: any[];
}
export interface Props extends RouteComponentProps<{ id: any }>, FormComponentProps<Fields> {}
export interface Fields {
  templateName: string;
  commonCost: number;
  defaultNumber: number;
  increaseNumber: number;
  increaseCost: number;
}

export interface rankItem {
  rankNo: number;
  destination: string;
  rankType: number;
  cost: number;
  firstFeeNumber: number;
  renewalNumber: number;
  renewalCost: number;
  destinationList: any[]
  uid: string
}