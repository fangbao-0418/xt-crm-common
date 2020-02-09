import React from 'react'
import { max } from 'moment';
interface Props {
  onChange?: any
  value?: any
}
function getYears (): number[] {
  const maxYear = new Date().getFullYear()
  let initYear = 2019
  const years = []
  while (initYear <= maxYear) {
    years.push(initYear)
    initYear++
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

class Main extends React.Component<Props> {
  public render () {
    return (
      <div>
        <select className='mr10'>
          {getYears().map((item) => {
            return <option>{item}</option>
          })}
        </select>
        <select>
          <option>全部</option>
          {getMonths().map((item) => {
            return <option>{item}</option>
          })}
        </select>
      </div>
    )
  }
}
export default Main
