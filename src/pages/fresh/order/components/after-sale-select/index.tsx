import React from 'react'
import { getRefundReason } from '../../api'
import { XtSelect } from '@/components'
interface Props {
  refundType: number,
}
interface State {
  refundReason: any
}
class AfterSaleSelect extends React.Component<Props, State> {
  state: State = {
    refundReason: {}
  }
  constructor (props: Props) {
    super(props)
    this.fetchReason()
  }
  private filterReason (obj: any) {
    return Object.entries(obj).map(([key, val]) => ({ key: +key, val }))
  }
  async fetchReason () {
    const refundReason = await getRefundReason()
    const result: any = {}
    for (const key in refundReason) {
      result[key] = this.filterReason(refundReason[key])
    }
    this.setState({ refundReason: result })
  }
  get refundReason () {
    const refundType = String(this.props.refundType)
    let result = []
    if (refundType && this.state.refundReason) {
      result = this.state.refundReason[refundType]
    }
    return result
  }
  render () {
    return <XtSelect {...this.props} data={this.refundReason} style={{ width: 200 }} />
  }
}
export default AfterSaleSelect