import React from 'react'
import { AutoComplete } from 'antd'
const { Option } = AutoComplete
interface Item {
  freightTemplateId: number
  templateName: string
}
interface Props {
  onChange?: (value: any) => void
  value?: string
  dataSource: Item[]
}
class Main extends React.Component<Props, any> {
  public render () {
    return (
      <AutoComplete
        placeholder='请输入'
        onChange={this.props.onChange}
        value={this.props.value}
        allowClear
        filterOption={(inputValue: string, option: any) => {
          const children = option.props.children
          return (
            children &&
            String(children)
              .toUpperCase()
              .indexOf(inputValue && String(inputValue).toUpperCase()) !== -1
          )
        }}
      >
        {(this.props.dataSource || []).map((item: Item, index: number) => (
          <Option key={index} value={item.freightTemplateId + ''}>
            {item.templateName || ''}
          </Option>
        ))}
      </AutoComplete>
    )
  }
}
export default Main
