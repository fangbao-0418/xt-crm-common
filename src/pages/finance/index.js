import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Log from './log'
import Order from './order'
import Withdraw from './withdraw'
import Bond from './bond'
import Records from './withdraw/records'
import WithdrawForm from './withdraw/form'
import AccountSettlement from './payment-manage/account-settlement'
import PaymentBill from './payment-manage/payment-bill'
import PaymentBillDetail from './payment-manage/payment-bill/detial'
import PaymentDetail from './payment-manage/payment-detail'
import SupplierWithdraw from './payment-manage/supplier-withdraw'
export default class extends Component {
  render () {
    return (
      <Switch>
        <Route path='/finance/log' component={Log} />
        <Route path='/finance/bond' component={Bond} />
        <Route path='/finance/order' component={Order} />
        <Route path='/finance/withdraw' exact component={Withdraw} />
        <Route path='/finance/withdraw/records' component={Records} />
        <Route path='/finance/withdraw/:id' component={WithdrawForm} />
        <Route path='/finance/accountsettlement' component={AccountSettlement} />
        <Route path='/finance/paymentbill' exact component={PaymentBill} />
        <Route path='/finance/paymentbill/:id' exact component={PaymentBillDetail} />
        <Route path='/finance/paymentdetail' component={PaymentDetail} />
        <Route path='/finance/supplierwithdraw' component={SupplierWithdraw} />
      </Switch>
    )
  }
}