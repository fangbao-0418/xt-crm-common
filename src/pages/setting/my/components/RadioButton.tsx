import React from 'react'
import { Button } from 'antd'
import { eq } from 'lodash'
interface options {
  value: string
  label: string
}
interface Props {
  dataSource: options[]
  onChange: (value: string) => void
  value: string
  className?: string
}
class Main extends React.Component<Props, any> {
  public constructor (props: Props) {
    super(props)
  }
  public render () {
    const { dataSource, value, className } = this.props
    return (
      <Button.Group className={className}>
        {dataSource.map((opts: options) => (
          <Button
            value={opts.value}
            onClick={() => {
              const res = eq(value, opts.value) ? '' : opts.value 
              this.props.onChange(res)
            }}
            type={eq(value, opts.value) ? 'primary' : 'default'}
          >
            {opts.label}
          </Button>
        ))}
      </Button.Group>
    )
  }
}
export default Main