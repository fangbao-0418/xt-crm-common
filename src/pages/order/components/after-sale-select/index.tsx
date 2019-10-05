import React from 'react';
import { getRefundReason } from '../../api';
import { XtSelect } from '@/components'
interface Props {
  refundType: string
}
interface State {
  refundReason: any
}
class AfterSaleSelect extends React.Component<Props, State>{
  public state: State = {
    refundReason: {}
  }
  public constructor(props: Props) {
    super(props)
    this.fetchReason();
  }
  private filterReason(obj: any) {
    return Object.entries(obj).map(([key, val]) => ({key, val}));
  }
  public async fetchReason() {
    const refundReason = await getRefundReason();
    const result: any = {}
    for (let key in refundReason) {
      result[key] = this.filterReason(refundReason[key])
    }
    console.log('result=>', result);
    this.setState({refundReason: result})
  }
  public getRefundReason() {
    const refundType = this.props.refundType;
    let result = []
    if (refundType && this.state.refundReason) {
      result = this.state.refundReason[refundType];
    }
    return result;
  }
  public render() {
    return <XtSelect {...this.props} data={this.getRefundReason()} style={{width: 200}}/>
  }
}
export default AfterSaleSelect;