import React from 'react'
import RouteComponent from '@/components/route-component'
import { Redirect } from 'react-router'
import Icon from './icon'
import Column from './column'
import Article from './article'
import ArticleDetail from './article/Detail'

const config = [
  { paht: '', exact: true, render: () => <Redirect to='/youxuan-business-school/icon' /> },
  { path: '/icon', component: Icon },
  { path: '/column', component: Column },
  { path: '/article', exact: true, component: Article },
  { path: '/article/:id', component: ArticleDetail }
]
class Main extends React.Component {
  public render () {
    return (
      <RouteComponent config={config} />
    )
  }
}

export default Main