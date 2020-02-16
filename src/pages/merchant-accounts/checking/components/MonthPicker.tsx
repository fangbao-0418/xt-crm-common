import React from 'react'
interface Props {
  onChange?: any
  value?: number[]
}
function getYears (): number[] {
  let maxYear = new Date().getFullYear()
  const minYear = 2019
  const years = []
  while (minYear <= maxYear) {
    years.push(maxYear)
    maxYear--
  }
  return years
}

function getMonths (): number[] {
  let i = 12
  const months = []
  while (i > 0) {
    months.push(i)
    i--
  }
  return months
}

interface State {
  value: number[]
}

class Main extends React.Component<Props, State> {
  public state: State = {
    value: []
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      value: props.value || []
    })
  }
  public onChange (type: 'y' | 'm', e: any) {
    const selectedValue = e.target.value ? Number(e.target.value) : e.target.value
    let value = this.state.value
    if (type === 'y') {
      value = [selectedValue]
      if (!selectedValue) {
        value = []
      }
    } else {
      value[1] = selectedValue
      if (!selectedValue) {
        value = [value[0]]
      }
    }
    console.log(type, selectedValue, '------------')
    if (this.props.onChange) {
      this.props.onChange(value)
    }
    this.setState({
      value
    })
  }
  public render () {
    const { value } = this.state
    const allYears = getYears()
    const allMonth = getMonths()
    return (
      <div
      >
        <select
          className='mr10'
          onChange={this.onChange.bind(this, 'y')}
          value={value[0] || ''}
          style={{verticalAlign: 'middle'}}
        >
          <option value=''>全部</option>
          {allYears.map((item) => {
            return <option value={item} key={item}>{item}</option>
          })}
        </select>
        <select
          onChange={this.onChange.bind(this, 'm')}
          value={value[1] || ''}
          style={{verticalAlign: 'middle'}}
        >
          <option value=''>全部</option>
          {allMonth.map((item) => {
            return (
              <option value={item} key={item}>
                {item < 10 ? `0${item}` : item}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}
export default Main
