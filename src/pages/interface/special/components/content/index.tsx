import React from 'react'
import { connect } from 'react-redux'
import { namespace } from '../../content/model'
import Card from './Card'
interface Props {
  detail: Special.DetailProps
  style?: any
}
class Main extends React.Component<Props> {
  public render () {
    const { detail, style } = this.props
    return (
      <div style={style}>
        {(detail.list || []).map((item, index) => {
          return (
            <Card
              key={index}
              detail={item}
              onChange={(value: any) => {
                if (value) {
                  detail.list[index] = value
                } else {
                  detail.list.splice(index, 1)
                }
                APP.dispatch({
                  type: `${namespace}/changeDetail`,
                  payload: { ...detail }
                })
              }}
            />
          )
        })}
      </div>
    )
  }
}
export default connect((state: any) => {
  return {
    detail: state[namespace].detail
  }
})(Main)
