import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
interface Props {
  value?: any[]
  onChange?: (value: any[]) => void
  showTime?: boolean
  format?: string
}
interface State {
  value: any[]
}
class Main extends React.Component<Props, State> {
  public state: State
  public ids: any[] = [1]
  public lastId = 1
  public constructor (props: Props) {
    super(props)
    this.operate = this.operate.bind(this)
    const value = this.handleValue(props.value)
    this.state = {
      value
    }
    this.setIds(value)
  }
  public componentWillReceiveProps (props: Props) {
    const value = this.handleValue(props.value)
    this.setState({
      value
    })
    this.setIds(value)
  }
  public handleValue (value?: any[]) {
    return value ? value : [undefined]
  }
  public operate (type: 'add' | 'del' = 'add',index: number) {
    let { value } = this.state
    if (type === 'add') {
      if (value.length >= 7) {
        return
      }
      value.splice(index + 1, -1, undefined)
      this.lastId++
      this.ids.splice(index + 1, -1, this.lastId)
    } else {
      this.ids.splice(index, 1)
      value = value.filter((item, i) => i !== index)
    }
    this.setState({
      value
    })
  }
  public setIds (value: any[] = this.props.value || []) {
    value.map((item, index) => {
      if (this.ids[index] === undefined) {
        this.lastId++
        this.ids[index] = this.lastId
      }
    })
  }
  public onChange (value: any[] = []) {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
  public getMomentValue (date: any) {
    if (/^\d+$/.test(date)) {
      date = Number(date)
    }
    const val = date ? moment(date) : undefined
    return val
  }
  public render () {
    const { showTime, format } = this.props
    const { value } = this.state
    console.log(value, this.ids, 'render')
    return (
      <div>
        <div style={{width: 300, marginRight: 10}}>
          {
            value.map((item, index) => {
              const val = this.getMomentValue(value[index])
              return (
                <div
                  key={this.ids[index]}
                >
                  <DatePicker
                    showTime={showTime}
                    value={val}
                    onChange={(date) => {
                      value[index] = (format ? date && date.format(format) : date) || undefined
                      this.onChange(value)
                    }}
                  />
                  <span
                    className={'href ml10'}
                    onClick={() => {
                      this.operate('add', index)
                    }}
                  >
                    增加
                  </span>
                  {index > 0 && (
                    <span
                      className={'error ml10'}
                      onClick={() => {
                        this.operate('del', index)
                      }}
                    >
                      删除
                    </span>
                  )}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
export default Main
