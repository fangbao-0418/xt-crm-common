import React from 'react'
import { Route, Switch } from 'react-router-dom'
import My from './my'
import Detail from './my/detail'
import Material from './material'
const Main = () => {
  return (
    <Switch>
      <Route path='/setting/my' exact component={My} />
      <Route path='/setting/my/:id' component={Detail} />
      <Route path='/setting/material' exact component={Material} />
    </Switch>
  )
}

export default Main