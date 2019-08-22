import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Category from './category';
import Hotkey from './hotkey';
export default class extends Component {
    render() {
        return (
            <Switch>
                <Route path="/interface/category" component={Category} />
                <Route path="/interface/hotkey" component={Hotkey} />
            </Switch>
        );
    }
}