import React from 'react'
import RouteComponent from '@/components/route-component'
import { Redirect } from 'react-router'
import Icon from './icon'
import Column from './column'

const config = [
  { paht: '', exact: true, render: () => <Redirect to='/haodian-business-school/icon' /> },
  { path: '/icon', component: Icon },
  { path: '/column', component: Column }
]
class Main extends React.Component {
  public render () {
    return (
      <RouteComponent config={config}/>
    )
  }
}

export default Main