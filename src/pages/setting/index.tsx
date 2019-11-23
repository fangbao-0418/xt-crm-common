import React from 'react'
import { Route, Switch } from 'react-router-dom'
import My from './my'
import Detail from './my/detail'
const Main = () => {
  return (
    <Switch>
      <Route path="/setting/my" exact component={My} />
      <Route path="/setting/my/:id" component={Detail} />
    </Switch>
  )
}

export default Main