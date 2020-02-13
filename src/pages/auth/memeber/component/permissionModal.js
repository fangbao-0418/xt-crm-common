import React, { Component } from 'react';
import { connect } from '@/util/utils';
import { Modal, Divider, Table } from 'antd';

@connect(state => ({
  visible: state['auth.member'].permissionVisible,
  roleConfig: state['auth.member'].roleConfig,
  selectedRowKeys: state['auth.member'].selectedRowKeys
}))
export default class extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch['auth.member'].getRoleList({
      page: 0,
      pageSize: -1
    });
  }
  render() {
    const { selectedRowKeys } = this.props;
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        align: 'center'
      }
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: selectedRowKeys => {
        console.log(selectedRowKeys);
        const { dispatch } = this.props;
        dispatch['auth.member'].saveDefault({
          selectedRowKeys
        });
      }
    };
    const { visible, roleConfig } = this.props;
    return (
      <Modal visible={visible} title="角色分配" destroyOnClose onCancel={this.onCancel} onOk={this.onOk}>
        <div>
          <span>真实姓名：吕焕</span>
          <span style={{ marginLeft: 48 }}>账号：lvhuan</span>
        </div>
        <Divider style={{ margin: '8px 0' }} />
        <Table
          rowKey="id"
          pagination={false}
          scroll={{ y: 240 }}
          columns={columns}
          dataSource={roleConfig.records}
          rowSelection={rowSelection}
        />
      </Modal>
    );
  }

  onCancel = () => {
    this.props.dispatch({
      type: 'auth.member/saveDefault',
      payload: {
        permissionVisible: false
      }
    });
  };

  onOk = () => {
    const { dispatch } = this.props;
    dispatch['auth.member'].saveRolesToUser();
  };
}
