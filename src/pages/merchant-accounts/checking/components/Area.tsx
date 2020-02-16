import React from 'react'
function fetchProvince () {
  return fetch('https://assets.hzxituan.com/data/v1.0.0/address/province.json').then((res) => {
    return res.json()
  })
}

function fetchCity () {
  return fetch('https://assets.hzxituan.com/data/v1.0.0/address/city.json').then((res) => {
    return res.json()
  })
}

interface Props {
  value?: {name: string, value: string}[]
  onChange?: (value: {name: string, value: string}[]) => void
}

interface State {
  province: {name: string, value: string}[]
  city: {name: string, value: string, parent: string}[]
  value: {name: string, value: string}[]
}

class Main extends React.Component<Props> {
  public state: State = {
    province: [{value: '', name: '省'}],
    city: [{value: '', name: '市', parent: '0'}],
    value: this.props.value || []
  }
  public city: {name: string, value: string, parent: string}[] = []
  public value: {name: string, value: string}[] = []
  public componentWillReceiveProps (props: Props) {
    this.setState({
      value: props.value || []
    })
  }
  public componentDidMount () {
    Promise.all([fetchProvince(), fetchCity()]).then(([res, res2]) => {
      const province = [{value: '', name: '省'}].concat(res || [])
      this.city = res2 || []
      this.setState({
        province
      })
      const value = this.props.value
      if (value) {
        this.getCity(value[0].name, value[0].value)
      }
    })
  }
  public getCity (name: string, value: string) {
    const city = this.city.filter((item) => {
      return item.parent === value
    })
    this.value = [{name, value}]
    this.setState({
      city: [{value: '', name: '市'}].concat(city)
    })
  }
  public onProviceChange (e: any) {
    let selectedOption: any = {}
    e.target.childNodes.forEach((item: {selected: boolean}) => {
      if (item.selected) {
        selectedOption = item
      }
    })
    const value = selectedOption.value
    const name = selectedOption.label
    this.getCity(name, value)
  }
  public onCityChange (e: any) {
    let selectedOption: any = {}
    e.target.childNodes.forEach((item: {selected: boolean}) => {
      if (item.selected) {
        selectedOption = item
      }
    })
    const value = selectedOption.value
    const name = selectedOption.label
    if (value) {
      this.value[1] = {name, value}
    } else {
      this.value = this.value.slice(0, 1)
    }
    this.onChange()
  }
  public onChange () {
    if (this.props.onChange) {
      this.props.onChange(this.value)
    }
  }
  public render () {
    const value = this.state.value
    console.log(value, '----')
    return (
      <div>
        <select
          value={value[0] && value[0].value}
          onChange={this.onProviceChange.bind(this)}
          className='mr10'
        >
          {this.state.province.map((item) => {
            return (
              <option
                key={item.value}
                value={item.value}
              >
                {item.name}
              </option>
            )
          })}
        </select>
        <select
          value={value[1] && value[1].value}
          onChange={this.onCityChange.bind(this)}
        >
          {this.state.city.map((item) => {
            return (
              <option
                key={item.value}
                value={item.value}
                // selected={item.value === (}
              >
                {item.name}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}
export default Main
