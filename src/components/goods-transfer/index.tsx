import * as React from 'react';
import { Transfer, Modal } from 'antd';

export default class extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      targetKeys: [],
      selectedKeys: [],
    };
  }
  componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        targetKeys: [],
        selectedKeys: [],
      });
    }
  }

  filterOption = (inputValue: any, option: any) => {
    return (
      option.productName.indexOf(inputValue) > -1 || `${option.productId}`.indexOf(inputValue) > -1
    );
  };

  handleChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  onOk = () => {
    const { onOk } = this.props;
    const { targetKeys } = this.state;
    onOk && onOk(targetKeys);
  };

  render() {
    const { dataSource, header, ...props } = this.props;
    const { targetKeys } = this.state;
    return (
      <Modal width={888} maskClosable={false} {...props} onOk={this.onOk}>
        {header}
        <Transfer
          rowKey={record => record.productId}
          dataSource={dataSource}
          render={item => {
            return (
              <span>
                <span>{item.productName}</span>
                <a>({item.productId})</a>
              </span>
            );
          }}
          showSearch
          filterOption={this.filterOption}
          targetKeys={targetKeys}
          onChange={this.handleChange}
          listStyle={{
            width: 400,
            height: 500,
          }}
        />
      </Modal>
    );
  }
}
