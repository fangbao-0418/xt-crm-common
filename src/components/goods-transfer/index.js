import React, { PureComponent } from 'react';
import { Transfer, Modal } from 'antd';

export default class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      targetKeys: [],
      selectedKeys: [],
      disabled: false,
    };
  }

  filterOption = (inputValue, option) => {
    return (
      option.productName.indexOf(inputValue) > -1 || `${option.productId}`.indexOf(inputValue) > -1
    );
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  onOk = () => {
    const { onOk } = this.props;
    const { targetKeys } = this.state;
    onOk && onOk(targetKeys);
  };

  render() {
    const { currentActivity = {}, transferActivity = {}, dataSource, ...props } = this.props;
    const { targetKeys } = this.state;

    return (
      <Modal width={688} title="转移活动商品" {...props} onOk={this.onOk}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ display: 'inline-block', width: '50%' }}>
            当前活动：{currentActivity.title}
          </span>
          <span style={{ display: 'inline-block', width: '50%', paddingLeft: 20 }}>
            目标活动：{transferActivity.title}
          </span>
        </div>
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
            width: 300,
            height: 500,
          }}
        />
      </Modal>
    );
  }
}
