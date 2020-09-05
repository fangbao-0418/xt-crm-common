import React from 'react'
import RouteComponent from '@/components/route-component'

import GoodsList from './index'
import GoodsDetail from './detail'

const config = [
  { path: '', exact: true, component: GoodsList },
  { path: '/detail/:id', component: GoodsDetail },
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
