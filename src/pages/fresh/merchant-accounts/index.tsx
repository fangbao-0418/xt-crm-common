import React from 'react'
import { RouteProps } from 'react-router'
import RouteComponent from '@/components/route-component'
import Checking from './checking'
import CheckingDetail from './checking/Detail'
import Withdraw from './withdraw'
import Adjustment from './adjustment'

const config: RouteProps[] = [
  {
    path: '/checking',
    exact: true,
    component: Checking
  },
  {
    path: '/checking/:id',
    component: CheckingDetail
  },
  {
    path: '/withdraw',
    component: Withdraw
  },
  {
    path: '/adjustment',
    exact: true,
    component: Adjustment
  }
]

class Main extends React.Component {
  render () {
    return (
      <RouteComponent
        config={config}
      />
    )
  }
}

export default Main