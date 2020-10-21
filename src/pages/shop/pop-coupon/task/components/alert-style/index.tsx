import React from 'react'
import { Radio } from 'antd'

interface Props {
  value?: number
  onChange?: (value: number) => void
  readonly?: boolean
}

class Main extends React.Component<Props> {
  public onChange = (value: number) => {
    this.props?.onChange?.(value)
  }
  public render () {
    const { value, readonly } = this.props
    return (
      <div className='mt8'>
        <Radio.Group
          value={value}
          disabled={readonly}
          onChange={(e) => this.onChange(e.target.value)}
        >
          <div style={{ display: 'inline-block', marginRight: 30 }} >
            <Radio value={1}>普通</Radio>
            <div className='mt8'>
              <img style={{ width: 130, height: 200 }} src={(require('./images/common.png'))}></img>
            </div>
          </div>
          {/* <div style={{ display: 'inline-block' }} >
            <Radio value={2}>定制</Radio>
            <div className='mt8'>
              <img style={{ width: 130, height: 200 }} src={(require('@/assets/images/dingzhi.png'))}></img>
            </div>
          </div> */}
        </Radio.Group>
      </div>
    )
  }
}
export default Main
