import React from 'react'
import { Route, Switch, RouteComponentProps } from 'react-router-dom'
import { RouteProps, withRouter } from 'react-router'
interface Props extends RouteComponentProps {
  config: RouteProps[]
}

class Main extends React.Component<Props> {
  render () {
    const { match, config } = this.props
    return (
      <Switch>
        {
          config.map((item, index) => {
            return (
              <Route
                key={item.path + `-${index}`}
                {...item}
                path={`${match.url}${item.path}`}
              />
            )
          })
        }
      </Switch>
    )
  }
}

export default withRouter(Main)