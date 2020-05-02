import React from 'react'
import { Button } from 'antd'
import If from '@/packages/common/components/if'
import Adjustment from './components/Adjustment'
import Audit from './components/Audit'
import styles from './style.module.styl'
import * as api from './api'
import { InfoResponse, ReviewEnclosure } from './interface'
// import { GetListOnPageResponse } from '../checking/interface'
import Auth from '@/components/auth'
interface Props {
  id?: number | undefined
  onOk?: () => void
  onCancel?: () => void
  /** 对账单信息 */
  checkingInfo?: any
  type: 'add' | 'audit' | 'view'
}

interface State {
  /** 单据状态，10：待初审，20：待复审，30：审核通过，40：审核不通过，50：已撤销 */
  billStatus: 10 | 20 | 30 | 40 | 50
  /** 采购审核信息 */
  firstVerifyInfo?: ReviewEnclosure
  /** 财务审核信息 */
  secondVerifyInfo?: ReviewEnclosure
}

class Main extends React.Component<Props, State> {
  public adjustmentRef: Adjustment
  /** 采购 */
  public audit1Ref: Audit
  /** 财务 */
  public audit2Ref: Audit
  public state: State = {
    billStatus: 10
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    const id = this.props.id
    if (id) {
      api.fetchInfo(id).then((res) => {
        this.setState({
          billStatus: res.billStatus,
          firstVerifyInfo: res.firstVerifyInfo,
          secondVerifyInfo: res.secondVerifyInfo
        })
        this.setValues(res)
      })
    }
  }
  public setValues (values: InfoResponse) {
    values.billMoney = APP.fn.formatMoneyNumber(values.billMoney, 'm2u')
    values.fileVoucher = this.handleFileValue(values.fileVoucher)
    values.imgVoucher = this.handleFileValue(values.imgVoucher)
    /** 调整单信息 */
    this.adjustmentRef.form.setValues(values)

    /** 初审信息 */
    const firstVerifyInfo: any = values.firstVerifyInfo
    if (this.audit1Ref && values.firstVerifyInfo) {
      firstVerifyInfo.imgVoucher = this.handleFileValue(firstVerifyInfo.imgVoucher)
      firstVerifyInfo.fileVoucher = this.handleFileValue(firstVerifyInfo.fileVoucher)
      firstVerifyInfo.verifyTime = APP.fn.formatDate(values.firstVerifyTime) as any
      this.audit1Ref.form.setValues({
        ...values,
        ...firstVerifyInfo
      })
    }

    /** 复审信息 */
    const secondVerifyInfo: any = values.secondVerifyInfo
    if (this.audit2Ref && values.secondVerifyInfo) {
      secondVerifyInfo.imgVoucher = this.handleFileValue(secondVerifyInfo.imgVoucher)
      secondVerifyInfo.fileVoucher = this.handleFileValue(secondVerifyInfo.fileVoucher)
      secondVerifyInfo.verifyTime = APP.fn.formatDate(values.secondVerifyTime) as any
      this.audit2Ref.form.setValues({
        ...values,
        ...secondVerifyInfo
      })
    }
  }
  public handleFileValue (value: any) {
    if (value instanceof Array) {
      return value.map((item) => {
        return {
          url: item.rurl | item.url,
          name: item.name
        }
      })
    }
    value = value || ''
    let result: any
    try {
      result = JSON.parse(value)
      result = (result || []).map((item: {url: string, rurl: string, name: string}) => {
        return {
          url: item.rurl || item.url,
          name: item.name
        }
      })
    } catch (e) {
      try {
        result = value.split(',').map((item: {url: string}) => ({ url: item }))
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
      const imgVoucher = (value.imgVoucher || []).map((item: {name: string, rurl: string}) => {
        return {
          url: item.rurl,
          name: item.name
        }
      })
      const fileVoucher = (value.fileVoucher || []).map((item: {name: string, rurl: string}) => {
        return {
          url: item.rurl,
          name: item.name
        }
      })
      const supplier = value.supplier || {}
      value = {
        ...value,
        supplierId: value.supplierId != undefined ? value.supplierId : supplier.key,
        supplierName: supplier.label,
        supplier: undefined,
        imgVoucher,
        fileVoucher,
        billMoney: APP.fn.formatMoneyNumber(value.billMoney, 'u2m')
      }
      api.addAdjustment(value).then(() => {
        if (this.props.onOk) {
          this.props.onOk()
        }
      })
    })
  }
  public toAudit () {
    const { billStatus } = this.state
    if ([10, 20].indexOf(billStatus) === -1) {
      APP.error('该状态不能进行审核')
      return
    }
    const auditRef = billStatus === 10 ? this.audit1Ref : this.audit2Ref
    auditRef.form.props.form.validateFields((err, value) => {
      value.adjustmentRecordSerialNo = this.props.id
      value.fileVoucher = (value.fileVoucher || []).map((item: {name: string, rurl: string}) => {
        return {
          url: item.rurl,
          name: item.name
        }
      })
      value.imgVoucher = (value.imgVoucher || []).map((item: {name: string, rurl: string}) => {
        return {
          url: item.rurl,
          name: item.name
        }
      })
      let type: 0 | 1 = 0
      if (billStatus === 10) {
        type = 0
      } else if (billStatus === 20) {
        type = 1
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
    const { billStatus, firstVerifyInfo, secondVerifyInfo } = this.state
    return (
      <div className={styles.detail}>
        <If condition={type === 'add'}>
          <Adjustment
            // from={this.props.checkingInfo && 'checking'}
            ref={(ref) => {
              this.adjustmentRef = ref as Adjustment
            }}
          />
        </If>
        <If condition={type !== 'add'}>
          <div className={styles['detail-title']}>调整单信息</div>
          <Adjustment
            ref={(ref) => {
              this.adjustmentRef = ref as Adjustment
            }}
            readonly={!!this.props.id}
          />
          <If condition={billStatus !== 50}>
            <If condition={billStatus === 10}>
              <Auth code='adjustment:procurement_audit'>
                <div className={styles['detail-title']}>初审信息</div>
                <Audit
                  // readonly={type === 'view' || trimStatus !== 10}
                  ref={(ref) => {
                    this.audit1Ref = ref as Audit
                  }}
                />
              </Auth>
            </If>
            <If condition={billStatus === 20}>
              <If condition={!!firstVerifyInfo}>
                <div className={styles['detail-title']}>初审信息</div>
                <Audit
                  readonly={true}
                  ref={(ref) => {
                    this.audit1Ref = ref as Audit
                  }}
                />
              </If>
              <Auth code='adjustment:finance_audit'>
                <div className={styles['detail-title']}>复审信息</div>
                <Audit
                  // readonly={type === 'view' || trimStatus !== 20}
                  ref={(ref) => {
                    this.audit2Ref = ref as Audit
                  }}
                />
              </Auth>
            </If>
            {/** 非审核状态有审核信息就显示审核信息 */}
            <If condition={[10, 20].indexOf(billStatus) === -1}>
              <If condition={!!firstVerifyInfo}>
                <div className={styles['detail-title']}>初审信息</div>
                <Audit
                  readonly={true}
                  ref={(ref) => {
                    this.audit1Ref = ref as Audit
                  }}
                />
              </If>
              <If condition={!!secondVerifyInfo}>
                <div className={styles['detail-title']}>复审信息</div>
                <Audit
                  readonly={true}
                  ref={(ref) => {
                    this.audit2Ref = ref as Audit
                  }}
                />
              </If>
            </If>
          </If>
        </If>
        <hr style={{ opacity: .3 }} />
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
