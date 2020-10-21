import React from 'react'
import { Radio, Row, DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { disabledDate as beforeDisabledDate, afterDisabledDate } from '@/pages/helper'

const radioStyle = {
  display: 'block',
  margin: '8px 0 8px'
}

interface ValueProps {
  key: number
  value?: any
}

interface Props {
  value?: ValueProps
  onChange?: (value: ValueProps) => void
  readonly?: boolean
}

interface State {
  value: ValueProps
}


function getDisabledTime (current: Moment, end: Moment, type: 'gt' | 'lt') {
  current = current || moment()
  function range (min: number, max: number) {
    const res = []
    for (let i = min; i < max; i++) {
      res.push(i)
    }
    return res
  }
  const currentDate = current && current.format('YYYY-MM-DD')
  const endDate = end && end.format('YYYY-MM-DD')
  if (currentDate !== endDate) {
    return {}
  }
  if (!end) {
    return {}
  }
  if (type === 'lt') {
    const currentInfo = current ? [current.hour(), current.minute(), current.second()] : []
    const endInfo = [end.hour(), end.minute(), end.second()]
    return {
      disabledHours: () => range(endInfo[0] + 1, 24),
      disabledMinutes: () => currentInfo[0] === endInfo[0] ? range(endInfo[1] + 1, 60) : [],
      disabledSeconds: () => currentInfo[0] === endInfo[0] && currentInfo[1] === endInfo[1] ? range(endInfo[2] + 1, 60) : []
    }
  } else {
    const currentInfo = [current.hour(), current.minute(), current.second()]
    const endInfo = [end.hour(), end.minute(), end.second()]
    return {
      disabledHours: () => range(0, endInfo[0]),
      disabledMinutes: () => currentInfo[0] === endInfo[0] ? range(0, endInfo[1]) : [],
      disabledSeconds: () => currentInfo[0] === endInfo[0] && currentInfo[1] === endInfo[1] ? range(0, endInfo[2]) : []
    }
  }
}

class Main extends React.Component<Props, State> {
  public state: State = {
    value: {
      key: 0
    }
  }
  public onChange (value: ValueProps) {
    this.props?.onChange?.(value)
  }
  public render () {
    const { key, value } = this.props.value || {}
    const { readonly } = this.props
    return (
      <div>
        <Radio.Group
          value={key}
          disabled={readonly}
          onChange={(e) => {
            this.onChange({
              key: e.target.value
            })
          }}
        >
          <Radio style={radioStyle} value={0}>立即发送</Radio>
          <Radio style={radioStyle} value={1}>定时发送</Radio>
          {key === 1 && (
            <Row type='flex'>
              <span>选择时间：</span>
              <DatePicker
                value={value && moment(value)}
                showTime
                disabledDate={(currentDate) => {
                  return currentDate ? (currentDate.clone().endOf('day') < moment() || moment().endOf('day').add(30, 'day') < currentDate) : false
                }}
                disabledTime={(current?: Moment | null) => {
                  // console.log(current, moment().toNow(), 'xxxxxxx')
                  return (current && getDisabledTime(current, moment(), 'gt')) as any
                }}
                disabled={readonly}
                onChange={(e) => {
                  this.onChange({
                    key,
                    value: (e?.unix() || 0) * 1000
                  })
                }}
              />
              <span className='ml10'>（定时发送最多30天）</span>
            </Row>
          )}
        </Radio.Group>
      </div>
    )
  }
}
export default Main
