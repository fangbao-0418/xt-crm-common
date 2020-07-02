import React from 'react'
import { Checkbox } from 'antd'
import Item from './Item'
import ActivitySelector from '../activity-selector'
import { timeStamp } from 'console'

interface State {
  dataSource: any[]
}

interface Props {
  value?: any[]
  onChange?: (value: any[]) => void
}

class Main extends React.Component<Props, State> {
  public activitySelector: ActivitySelector
  public state: State = {
    dataSource: this.props.value || []
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: props.value || []
    })
  }
  public onChange () {
    this.props.onChange?.(this.state.dataSource)
  }
  public render () {
    const { dataSource } = this.state
    return (
      <div>
        <Checkbox checked>关联活动</Checkbox>
        <div>
          <span
            className='href'
            onClick={() => {
              this.activitySelector.open(dataSource)
            }}
          >
            +添加活动
          </span>
        </div>
        <div>
          {
            dataSource.map((item) => {
              return (
                <Item
                  key={item.id}
                  title={item.title}
                  onRemove={() => {
                    this.setState({
                      dataSource: dataSource.filter((val) => val.id !== item.id)
                    }, () => {
                      this.onChange()
                    })
                  }}
                />
              )
            })
          }
          <ActivitySelector
            getInstance={(ref) => {
              this.activitySelector = ref
            }}
            onOk={(keys, rows) => {
              this.setState({
                dataSource: rows
              }, () => {
                this.onChange()
              })
            }}
          />
        </div>
      </div>
    )
  }
}
export default Main
