import React from 'react';
import { AutoComplete } from 'antd';
import { isFunction } from 'lodash';
const { Option } = AutoComplete;
interface Item {
  freightTemplateId: number;
  templateName: string;
}
interface Props {
  onChange(): void;
  value: string;
  dataSource: Item[];
}

let addItem:any = null;
class Main extends React.Component<Props, any> {
  public render() {
    const { dataSource } = this.props;
    return (
      <AutoComplete
        placeholder="请输入"
        onChange={this.props.onChange}
        value={this.props.value}
        allowClear
        filterOption={(inputValue: string, option: any) => {
          const children = option.props.children;
          return (
            children &&
            String(children)
              .toUpperCase()
              .indexOf(inputValue && String(inputValue).toUpperCase()) !== -1
          );
        }}
      >
        {(dataSource || []).map(({ freightTemplateId, templateName }: Item, index: number) => (
          <Option key={freightTemplateId || index}>{templateName || ''}</Option>
        ))}
      </AutoComplete>
    );
  }
}
export default Main;
