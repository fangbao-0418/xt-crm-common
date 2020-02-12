import React from 'react'
import { Card } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import * as api from './api'
interface Props { }
class Main extends React.Component<Props, any> {
  public form: FormInstance
  // 活动ID
  public luckyDrawRoundId: number
  // 用户ID
  public memberId: number

  public readOnly = true
  public constructor(props: any) {
    super(props)
    this.luckyDrawRoundId = +props.match.params.luckyDrawRoundId
    this.memberId = +props.match.params.memberId
    this.state = {}
  }


  public componentDidMount() {
    if (this.memberId !== -1) {
      this.fetchDetail()
    }
  }
  /** 获取场次详情 */
  public async fetchDetail() {
    const res = await api.activeFinishDetail({
      activeId: this.luckyDrawRoundId,
      memberId: this.memberId
    })
    res.serverRatio = res.serverRatio / 100 + '%'
    this.form.setValues(res)
    this.setState({
      activeType: res.activeType
    })
  }

  public async ExportData() {
    await api.activeFinishExport({
      activeId: this.luckyDrawRoundId,
      memberId: this.memberId
    })
  }

  public render() {
    const { activeType } = this.state
    return (
      <Form
        readonly={this.readOnly}
        getInstance={ref => this.form = ref}
      >
        <Card title='详细信息'>
          <FormItem
            name='activeName'
            type='input'
            label='活动名称'
          />
          <FormItem
            name='activeNo'
            type='input'
            label='场次名称'
          />
          <FormItem
            name='activeTypeDesc'
            type='input'
            label='活动类型'
          />
          <FormItem
            name='phone'
            type='input'
            label='手机号'
          />
          <FormItem
            style={{display: activeType == 10 ? 'block':'none'}}
            name='upgradeTypeDesc'
            type='input'
            label='升级方式'
          />
          <FormItem
            name='validNumber'
            type='input'
            label='有效订单数量'
          />
          <FormItem
            name='invalidNumber'
            type='input'
            label='无效订单数'
          />
          <FormItem
            style={{display: activeType == 10 ? 'block':'none'}}
            name='totalAmount'
            type='input'
            label='订单总金额'
          />
          <FormItem
            name='totalHighPriceNumber'
            style={{display: activeType == 10 ? 'block':'none'}}
            type='input'
            label='礼包数量'
          />
          <FormItem
            style={{display: activeType == 10 ? 'block':'none'}}
            name='participants'
            type='input'
            label='参与人数'
          />
          <FormItem
            style={{display: activeType == 10 ? 'block':'none'}}
            name='unitPrice'
            type='input'
            label='客单价'
          />
          <FormItem
            style={{display: activeType == 10 ? 'block':'none'}}
            name='serverRatio'
            type='input'
            label='售后比例'
          />
          <FormItem
            label='订单明细'
          ><a onClick={()=>this.ExportData()}>下载数据</a></FormItem>
        </Card>
      </Form>
    )
  }
}
export default Main
