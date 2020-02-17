import React from 'react'
import { Button } from 'antd'
import If from '@/packages/common/components/if'
import Adjustment from './components/Adjustment'
import Audit from './components/Audit'
import styles from './style.module.styl'
import * as api from './api'
import { InfoResponse, ReviewEnclosure } from './interface'
import { GetListOnPageResponse } from '../checking/interface'
import Auth from '@/components/auth'
interface Props {
  id?: number | undefined
  onOk?: () => void
  onCancel?: () => void
  /** 对账单信息 */
  checkingInfo?: GetListOnPageResponse
  type: 'add' | 'audit' | 'view'
}

interface State {
  /** 调整单状态 10待采购审核、20待财务审核、30审核通过、40审核不通过、50已失效 */
  trimStatus: 10 | 20 | 30 | 40 | 50
  /** 采购审核信息 */
  purchaseReviewEnclosure?: ReviewEnclosure
  /** 财务审核信息 */
  financeReviewEnclosure?: ReviewEnclosure
}

class Main extends React.Component<Props, State> {
  public adjustmentRef: Adjustment
  /** 采购 */
  public audit1Ref: Audit
  /** 财务 */
  public audit2Ref: Audit
  public state: State = {
    trimStatus: 10
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    const id = this.props.id
    console.log(this.props)
    // return
    if (id) {
      api.fetchInfo(id).then((res) => {
        this.setState({
          trimStatus: res.trimStatus,
          purchaseReviewEnclosure: res.purchaseReviewEnclosure,
          financeReviewEnclosure: res.financeReviewEnclosure
        })
        this.setValues(res)
      })
    } else {
      const checkingInfo = this.props.checkingInfo
      if (checkingInfo) {
        this.adjustmentRef.form.setValues({
          accNo: checkingInfo.serialNo,
          accName: checkingInfo.accName
        })
      }
    }
  }
  public setValues (values: InfoResponse) {
    values.trimMoney = APP.fn.formatMoneyNumber(values.trimMoney, 'm2u')
    const trimEnclosure = values.trimEnclosure || {
      trimExplain: '',
      trimFileUrl: '',
      trimImgUrl: ''
    }
    values.accNo = values.serialNo
    values.trimExplain = trimEnclosure.trimExplain
    values.trimFileUrl = this.handleFileValue(trimEnclosure.trimFileUrl)
    values.trimImgUrl = this.handleFileValue(trimEnclosure.trimImgUrl)
    values.purchaseReviewTime = APP.fn.formatDate(values.purchaseReviewTime) as any
    values.financeReviewTime = APP.fn.formatDate(values.financeReviewTime) as any
    /** 调整单信息 */
    this.adjustmentRef.form.setValues(values)
    const trimStatus = values.trimStatus
    if (trimStatus !== 10) {
      const purchaseReviewEnclosure: any = values.purchaseReviewEnclosure || {}
      purchaseReviewEnclosure.trimImgUrl = this.handleFileValue(purchaseReviewEnclosure.trimImgUrl)
      purchaseReviewEnclosure.trimFileUrl = this.handleFileValue(purchaseReviewEnclosure.trimFileUrl)
      /** 采购审核信息 */
      if (this.audit1Ref) {
        this.audit1Ref.form.setValues({
          ...values,
          reviewStatus: values.purchaseReviewStatus,
          ...purchaseReviewEnclosure
        })
      }
    }
    if ([10, 20].indexOf(trimStatus) === -1) {
      const financeReviewEnclosure: any = values.financeReviewEnclosure || {}
      financeReviewEnclosure.trimImgUrl = this.handleFileValue(financeReviewEnclosure.trimImgUrl)
      financeReviewEnclosure.trimFileUrl = this.handleFileValue(financeReviewEnclosure.trimFileUrl)
      /** 财务审核信息 */
      if (this.audit2Ref) {
        this.audit2Ref.form.setValues({
          ...values,
          reviewStatus: values.financeReviewStatus,
          ...financeReviewEnclosure
        })
      }
    }
  }
  public handleFileValue (value: string) {
    value = value || ''
    let result: any
    try {
      result = JSON.parse(value)
      result.map((item: {url: string, rurl: string}) => {
        /** 处理相对路径 */
        item.url = item.rurl || item.url
      })
    } catch (e) {
      try {
        result = value.split(',').map((item) => ({url: item}))
      } catch (e) {
        result = undefined
      }
    }
    return result
  }
  public validateField () {
    this.adjustmentRef.form.props.form.validateFields((err, value) => {
      if (err) {
        APP.error('请检查输入项')
        return
      }
      value = {
        ...value,
        trimImgUrl: JSON.stringify(value.trimImgUrl || []),
        trimFileUrl: JSON.stringify(value.trimFileUrl || []),
        trimMoney: APP.fn.formatMoneyNumber(value.trimMoney, 'u2m')
      }
      api.addAdjustment(value).then(() => {
        if (this.props.onOk) {
          this.props.onOk()
        }
      })
    })
  }
  public toAudit () {
    const { trimStatus } = this.state
    if ([10, 20].indexOf(trimStatus) === -1) {
      APP.error('该状态不能进行审核')
      return
    }
    const auditRef = trimStatus === 10 ? this.audit1Ref : this.audit2Ref
    auditRef.form.props.form.validateFields((err, value) => {
      value.trimId = this.props.id
      value.trimFileUrl = JSON.stringify(value.trimFileUrl)
      value.trimImgUrl = JSON.stringify(value.trimImgUrl)
      let type: 'purchase' | 'finance' = 'purchase'
      if (trimStatus === 10) {
        type = 'purchase'
      } else if (trimStatus === 20) {
        type = 'finance'
      }
      api.toAudit(value, type).then(() => {
        APP.success('操作完成')
        if (this.props.onOk) {
          this.props.onOk()
        }
      })
    })
  }
  public render () {
    const type = this.props.type
    const { trimStatus, financeReviewEnclosure, purchaseReviewEnclosure } = this.state
    return (
      <div className={styles.detail}>
        <If condition={type === 'add'}>
          <Adjustment
            from={this.props.checkingInfo && 'checking'}
            ref={(ref) => { this.adjustmentRef = ref as Adjustment }}
          />
        </If>
        <If condition={type !== 'add'}>
          <div className={styles['detail-title']}>调整单信息</div>
          <Adjustment
            ref={(ref) => { this.adjustmentRef = ref as Adjustment }}
            readonly={!!this.props.id}
          />
          <If condition={trimStatus !== 50}>
            <If condition={trimStatus === 10}>
              <Auth code='adjustment:procurement_audit'>
                <div className={styles['detail-title']}>采购审核信息</div>
                <Audit
                  type='purchase'
                  // readonly={type === 'view' || trimStatus !== 10}
                  ref={(ref) => { this.audit1Ref = ref as Audit }}
                />
              </Auth>
            </If>
            <If condition={trimStatus === 20}>
              <If condition={!!purchaseReviewEnclosure}>
                <div className={styles['detail-title']}>采购审核信息</div>
                <Audit
                  type='purchase'
                  readonly={true}
                  ref={(ref) => { this.audit1Ref = ref as Audit }}
                />
              </If>
              <Auth code='adjustment:finance_audit'>
                <div className={styles['detail-title']}>财务审核信息</div>
                <Audit
                  type='finance'
                  // readonly={type === 'view' || trimStatus !== 20}
                  ref={(ref) => { this.audit2Ref = ref as Audit }}
                />
              </Auth>
            </If>
            {/** 非审核状态有审核信息就显示审核信息 */}
            <If condition={[10, 20].indexOf(trimStatus) === -1}>
              <If condition={!!purchaseReviewEnclosure}>
                <div className={styles['detail-title']}>采购审核信息</div>
                <Audit
                  type='purchase'
                  readonly={true}
                  ref={(ref) => { this.audit1Ref = ref as Audit }}
                />
              </If>
              <If condition={!!financeReviewEnclosure}>
                <div className={styles['detail-title']}>财务审核信息</div>
                <Audit
                  type='finance'
                  readonly={true}
                  ref={(ref) => { this.audit2Ref = ref as Audit }}
                />
              </If>
            </If>
          </If>
        </If>
        <hr style={{opacity: .3}} />
        <div className='text-right'>
          <Button
            className='mr10'
            onClick={() => {
              if (type === 'add') {
                this.validateField()
              } else if (type === 'audit') {
                this.toAudit()
              } else {
                if (this.props.onCancel) {
                  this.props.onCancel()
                }
              }
            }}
            type='primary'
          >
            确定
          </Button>
          <Button
            onClick={() => {
              if (this.props.onCancel) {
                this.props.onCancel()
              }
            }}
          >
            取消
          </Button>
        </div>
      </div>
    )
  }
}
export default Main
