import React from 'react'
import { formConfigs } from './config'
import SearchForm from './form';
interface State {

}
class Main extends React.Component<any, State>{
  public render() {
    return (
      <div>
        <SearchForm dataSource={formConfigs} layout={{ span: 6 }} />
      </div>
    )
  }
}
export default Main;