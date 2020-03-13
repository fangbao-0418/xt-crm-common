import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Log from './log';
import Order from './order';
import Withdraw from './withdraw';
import Records from './withdraw/records';
import WithdrawForm from './withdraw/form';
export default class extends Component {
    render() {
        return (
            <Switch>
                <Route path="/finance/log" component={Log} />
                <Route path="/finance/order" component={Order} />
                <Route path="/finance/withdraw" exact component={Withdraw} />
                <Route path='/finance/withdraw/records' component={Records} />
                <Route path='/finance/withdraw/:id' component={WithdrawForm} />
            </Switch>
        );
    }
}