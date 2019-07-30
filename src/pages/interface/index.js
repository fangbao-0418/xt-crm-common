import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Category from './category';

export default class extends Component {
    render() {
        return (
            <Switch>
                <Route path="/interface/category" component={Category} />
            </Switch>
        );
    }
}