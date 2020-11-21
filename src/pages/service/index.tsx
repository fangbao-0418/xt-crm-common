import React from 'react'
import RouteComponent from '@/components/route-component'
import { Redirect } from 'react-router'
import Guarantee from './guarantee'
import FreightInsurance from './freight-insurance'
import Download from './download'

const config = [
  { paht: '', exact: true, render: () => <Redirect to='/service/guarantee' /> },
  { path: '/guarantee', component: Guarantee },
  { path: '/freight-insurance', component: FreightInsurance },
  { path: '/freight-insurance-download', component: Download }
]
class Main extends React.Component {
  public render () {
    return (
      <RouteComponent config={config} />
    )
  }
}

export default Main