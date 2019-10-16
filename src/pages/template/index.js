import React, { Component } from 'react';
import page from './page';
import edit from './edit';
import { Switch, Route } from 'react-router-dom';
export default class extends Component {
  render() {
    return (
      <Switch>
        <Route path="/template/page" component={page} />
        <Route path="/template/edit" component={edit} />
      </Switch>
    );
  }
}