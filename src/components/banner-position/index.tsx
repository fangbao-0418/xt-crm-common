import React from 'react'
import { Cascader } from 'antd'

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
];
class Main extends React.Component {
  public state = {
    options,
  };
  public componentDidMount () {

  }
  public onChange = (value: any, selectedOptions: any) => {
    console.log(value, selectedOptions);
  };
  public loadData (selectedOptions: any) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
  }
  public render () {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
      />
    )
  }
}
export default Main