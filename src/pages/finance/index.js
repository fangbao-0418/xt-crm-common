import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Log from './log'
import Order from './order'
import Withdraw from './withdraw'
import Bond from './bond'
import Records from './withdraw/records'
import WithdrawForm from './withdraw/form'
import PaymentBill from './payment-manage/payment-bill' // 货款账单
import PaymentBillDetail from './payment-manage/payment-bill/detial' // 货款账单详情
import PaymentDetail from './payment-manage/payment-detail' // 货款结算明细
import SupplierWithdraw from './payment-manage/supplier-withdraw' // 供应商提现管理
import AccountSettlement from './payment-manage/account-settlement'// 账务调整-内部（一次性账务结算）

import AccountDivided from './payment-manage/account-divided' // 分账流水
import OrderAccountDivided from './payment-manage/order-account-divided' // 订单待清分流水
import CommissionSettlement from './payment-manage/commission-settlement' // 佣金结算流水

import ExternalSupplierBalance from './external-manage/supplier-balance' // 外部账户余额查询-供应商
import ExternalAccountSettlement from './external-manage/account-settlement' // 账务调整-外部
import ExternalAccountDivided from './external-manage/external-account-divided' // 外部分账流水汇总
import ExternalDetail from './external-manage/external-detail' // 外部分账流水明细
import ExternalWithdrawDetail from './external-manage/withdraw-detail' // 提现账户明细
import InvoiceAudit from './external-manage/invioce-audit' // 发票管理
import ExternalXituanBalance from './external-manage/xituan-balance' // 外部账户余额查询-喜团
import Download from './download-list' // 导出
import DistrictChiefAndAbove from './district-chief-and-above' // 区长及以上会员提现明细
import AdjustmentInterior from './adjustment/interior' // 财务调整-内部

export default class extends Component {
  render () {
    return (
      <Switch>
        <Route path='/finance/log' component={Log} />
        <Route path='/finance/bond' component={Bond} />
        <Route path='/finance/download' component={Download} />
        <Route path='/finance/order' component={Order} />
        <Route path='/finance/withdraw' exact component={Withdraw} />
        <Route path='/finance/withdraw/records' component={Records} />
        <Route path='/finance/withdraw/:id' component={WithdrawForm} />
        <Route path='/finance/accountsettlement' component={AccountSettlement} />
        <Route path='/finance/paymentbill' exact component={PaymentBill} />
        <Route path='/finance/paymentbill/:id' exact component={PaymentBillDetail} />
        <Route path='/finance/paymentdetail' component={PaymentDetail} />
        <Route path='/finance/supplierwithdraw' component={SupplierWithdraw} />
        <Route path='/finance/accountdivided' component={AccountDivided} />
        <Route path='/finance/commissionsettlement' component={CommissionSettlement} />
        <Route path='/finance/orderaccountdivided' component={OrderAccountDivided} />
        <Route path='/finance/externalaccountsettlement' component={ExternalAccountSettlement} />
        <Route path='/finance/externalsupplierbalance' component={ExternalSupplierBalance} />
        <Route path='/finance/externalaccountdivided' component={ExternalAccountDivided} />
        <Route path='/finance/externaldetail' component={ExternalDetail} />
        <Route path='/finance/externalwithdrawdetail' exact component={ExternalWithdrawDetail} />
        <Route path='/finance/externalinvoiceaudit' component={InvoiceAudit} />
        <Route path='/finance/externalxituanbalance' component={ExternalXituanBalance} />
        <Route path='/finance/district-chief-and-above' component={DistrictChiefAndAbove} />
        <Route path='/finance/adjustment/interior' component={AdjustmentInterior} />
      </Switch>
    )
  }
}