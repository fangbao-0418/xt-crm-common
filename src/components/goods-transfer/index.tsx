import * as React from 'react';
import { Transfer, Modal, Button, message } from 'antd';

export default class extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      targetKeys: [],
      selectedKeys: []
    };
  }
  componentWillReceiveProps(nextProps: any) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        targetKeys: [],
        selectedKeys: []
      });
    }
  }

  filterOption = (inputValue: any, option: any) => {
    return option.productName.indexOf(inputValue) > -1 || `${option.productId}`.indexOf(inputValue) > -1;
  };

  handleChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  onOk = () => {
    const { onOk } = this.props;
    const { targetKeys } = this.state;
    if (!targetKeys || (Array.isArray(targetKeys) && targetKeys.length === 0)) {
      return void message.error('请选择商品');
    }
    onOk && onOk(targetKeys);
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  closeModal = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    const { dataSource, header, currentGoodsList, index, ...props } = this.props;
    const { targetKeys, visible } = this.state;
    let tempDataSource = dataSource;
    if (currentGoodsList && currentGoodsList.length) {
      tempDataSource = dataSource.map((item: any) => {
        const isExist = currentGoodsList.find((goods: any) => {
          return (goods && goods.id) === item.productId;
        });
        if (isExist) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
        return item;
      });
    }

    const footer = (
      <div>
        <Button onClick={props.onCancel}>取消</Button>
        <Button className="xt-delay" type="primary" onClick={this.onOk}>
          确定
        </Button>
      </div>
    );
    return (
      <Modal getContainer={false} width={888} maskClosable={false} footer={footer} visible={visible} {...props}>
        {header}
        <Transfer
          rowKey={record => record.productId}
          dataSource={tempDataSource}
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
            height: 500
          }}
        />
      </Modal>
    );
  }
}
