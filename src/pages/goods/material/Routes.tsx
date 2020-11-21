import React from 'react'
import RouteComponent, { RouteConfigProps } from '@/components/route-component'
import Material from './index'
import InformList from './inform/List'

const config: RouteConfigProps[]  = [
  {
    path: '', exact: true, component: Material
  },
  {
    path: '/inform', component: InformList
  }
]

export default class extends React.Component {
  render () {
    return (
      <RouteComponent
        config={config}
      />
    )
  }
}