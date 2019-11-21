import React from 'react'
import { Route, Switch } from 'react-router-dom'
import My from './my'

const Main = () => {
  return (
    <Switch>
      <Route path="/setting/my" component={My} />
    </Switch>
  )
}

export default Main