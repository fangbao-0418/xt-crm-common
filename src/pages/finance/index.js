import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Log from './log';
import Order from './order';
import Withdraw from './withdraw';

export default class extends Component {
    render() {
        return (
            <Switch>
                <Route path="/finance/log" component={Log} />
                <Route path="/finance/order" component={Order} />
                <Route path="/finance/withdraw" component={Withdraw} />
            </Switch>
        );
    }
}