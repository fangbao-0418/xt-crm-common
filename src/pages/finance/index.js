import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Log from './log'
import Order from './order'
import Withdraw from './withdraw'
import Records from './withdraw/records'
import WithdrawForm from './withdraw/form'
import AccountSettlement from './payment-manage/account-settlement'
import PaymentBill from './payment-manage/payment-bill' //货款账单
import PaymentBillDetail from './payment-manage/payment-bill/detial' //货款账单详情
import PaymentDetail from './payment-manage/payment-detail' //货款结算明细
import SupplierWithdraw from './payment-manage/supplier-withdraw' //供应商提现管理
import AccountDivided from './payment-manage/account-divided' //分账流水
import OrderAccountDivided from './payment-manage/order-account-divided' //订单待清分流水
export default class extends Component {
  render () {
    return (
      <Switch>
        <Route path='/finance/log' component={Log} />
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
        <Route path='/finance/orderaccountdivided' component={OrderAccountDivided} />
      </Switch>
    )
  }
}